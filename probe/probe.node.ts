namespace $ {

	const watch = `
		window.bog_ssr_removed = 0
		window.bog_ssr_added = 0
		const observer = new MutationObserver( list => {
			for( const rec of list ) {
				for( const node of rec.removedNodes ) if( /^(TR|TD|TABLE|TBODY|A)$/.test( node.nodeName ) ) ++ window.bog_ssr_removed
				for( const node of rec.addedNodes ) if( /^(TR|TD|TABLE|TBODY|A)$/.test( node.nodeName ) ) ++ window.bog_ssr_added
			}
		} )
		observer.observe( document, { childList: true, subtree: true } )
		document.addEventListener( 'readystatechange', ()=> {
			if( document.readyState !== 'interactive' ) return
			observer.takeRecords()
			window.bog_ssr_removed = 0
			window.bog_ssr_added = 0
		} )
	`

	const ready = `typeof $ !== 'undefined' && document.readyState === 'complete' && !!$.$bog_ssr.Root( 0 ).dom_node().querySelector( 'tr' )`

	async function server( port: number ) {

		const bundle = $node.path.resolve( 'bog/ssr/-/node.js' )
		const child = $node.child_process.spawn( $node.process.execPath, [ bundle ], {
			env: { ... $node.process.env, PORT: String( port ) },
			stdio: 'ignore',
		} )

		for( let i = 0; i < 100; ++ i ) {
			try {
				await fetch( `http://127.0.0.1:${ port }/rows` )
				return child
			} catch {
				await $bog_probe_pause( 100 )
			}
		}

		child.kill()
		return $mol_fail( new Error( 'SSR server did not start' ) )
	}

	export async function $bog_ssr_probe_check( port = 3918 ) {

		const say = ( line: string )=> { $node.fs.writeSync( 1, line + '\n' ); return line }

		const bin = $bog_probe_chrome_bin()
		if( !bin ) return say( $bog_probe_skip )

		const child = await server( port )
		const profile = String( $node.fs.mkdtempSync( $node.path.join( $node.os.tmpdir(), 'bog-ssr-probe-' ) ) )
		const browser = new $bog_probe_browser( bin, profile )

		try {

			await browser.open()
			await browser.viewport( 800, 600 )
			await browser.send( 'Page.addScriptToEvaluateOnNewDocument', { source: watch }, browser.page )

			await browser.open_page( `http://127.0.0.1:${ port }/server-side-rendered`, ready )

			const hydrated = await browser.evaluate( `
				window.bog_ssr_marker = 1
				return {
					rows: document.querySelectorAll( 'table tbody tr' ).length,
					removed: window.bog_ssr_removed,
					added: window.bog_ssr_added,
				}
			`, 30000 ) as { rows: number, removed: number, added: number }

			say( `ssr: rows ${ hydrated.rows }, removed ${ hydrated.removed }, added ${ hydrated.added }` )

			await browser.evaluate( `document.querySelector( 'table tbody tr:first-child a' ).click(); return 1`, 30000 )
			await browser.until( `!!document.querySelector( '#detail-id' )`, 30000 )

			const detail = await browser.evaluate( `return {
				text: document.querySelector( '#detail-id' ).textContent,
				path: location.pathname,
				same: window.bog_ssr_marker === 1,
			}`, 30000 ) as { text: string, path: string, same: boolean }

			say( `ssr detail: ${ detail.path }, client routed ${ detail.same }` )

			await browser.open_page( `http://127.0.0.1:${ port }/client-side-rendered`, ready )

			const csr = await browser.evaluate( `return document.querySelectorAll( 'table tbody tr' ).length`, 30000 )
			say( `csr: rows ${ csr }` )

			await browser.evaluate( `document.querySelector( 'table tbody tr:first-child a' ).click(); return 1`, 30000 )
			await browser.until( `!!document.querySelector( '#detail-id' )`, 30000 )
			say( `csr detail: ${ await browser.evaluate( `return location.pathname`, 30000 ) }` )

			const ok = hydrated.rows === 1000 && hydrated.removed === 0 && hydrated.added === 0 && detail.same && detail.path.endsWith( detail.text ) && csr === 1000
			return say( ok ? 'hydration ok' : 'hydration broken' )

		} finally {
			browser.close()
			child.kill()
			try { $node.fs.rmSync( profile, { recursive: true, force: true } ) } catch {}
		}

	}

}
