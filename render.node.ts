namespace $ {

	export function $bog_ssr_render( this: $, path: string, rows: readonly $bog_ssr_entry[] ) {

		const app = this.$bog_ssr.make( {
			$: this,
			path: $mol_const( path ),
			rows: $mol_const( rows ),
		} )
		app[ Symbol.toStringTag ] = '$bog_ssr.Root(0)'

		const body = this.$mol_dom_context.document.createElement( 'body' )
		body.setAttribute( 'mol_view_root', '$bog_ssr' )

		try {
			return app.dom_tree( body ).outerHTML
		} finally {
			app.destructor()
		}

	}

	export function $bog_ssr_page( base: string, body: string, rows?: readonly $bog_ssr_entry[] ) {

		const state = rows
			? `<script type="application/json" id="bog_ssr_rows">${ JSON.stringify( rows ).replace( /</g, '\\u003c' ) }</script>`
			: ''

		return '<!doctype html><html lang="en"><head>'
			+ '<meta charset="utf-8">'
			+ '<meta name="viewport" content="width=device-width, initial-scale=1">'
			+ `<base href="${ base }">`
			+ '<title>$mol SSR</title>'
			+ state
			+ '<script src="web.js" defer></script>'
			+ '</head>'
			+ body
			+ '</html>'
	}

	export function $bog_ssr_html( this: $, path: string, rows: readonly $bog_ssr_entry[], base = '/' ) {

		if( path.startsWith( '/client-side-rendered' ) ) {
			return $bog_ssr_page( base, '<body mol_view_root="$bog_ssr"></body>' )
		}

		const body = this.$bog_ssr_render( path, rows )
		const state = /^\/((server-side-rendered|ssr-throughput)\/?)?$/.test( path ) ? rows : undefined

		return $bog_ssr_page( base, body, state )
	}

	export async function $bog_ssr_static( this: $, dir: string, base: string ) {

		const rows = await $bog_ssr_rows_load()
		const root = $node.path.resolve( dir )

		const pages: Record< string, string > = {
			'index.html': '/',
			'server-side-rendered/index.html': '/server-side-rendered',
			'client-side-rendered/index.html': '/client-side-rendered',
			'ssr-throughput/index.html': '/ssr-throughput',
			'initial-load/index.html': '/initial-load',
			'404.html': '/client-side-rendered',
		}

		for( const [ file, path ] of Object.entries( pages ) ) {
			const target = $node.path.join( root, file )
			$node.fs.mkdirSync( $node.path.dirname( target ), { recursive: true } )
			$node.fs.writeFileSync( target, this.$bog_ssr_html( path, rows, base ) )
		}

		$node.fs.writeFileSync( $node.path.join( root, 'rows' ), JSON.stringify( rows ) )

		for( const file of [ 'web.js', 'web.js.map' ] ) {
			$node.fs.copyFileSync( $node.path.join( __dirname, file ), $node.path.join( root, file ) )
		}

	}

	export async function $bog_ssr_handle( request: Request ) {

		const rows = await $bog_ssr_rows_load()
		const html = $.$bog_ssr_html( new URL( request.url ).pathname, rows )

		return new Response( html, {
			headers: { 'content-type': 'text/html;charset=utf-8' },
		} )
	}

}
