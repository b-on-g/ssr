namespace $ {

	export class $bog_ssr_route extends $mol_object {

		@ $mol_memo.method
		static base() {
			const document = this.$.$mol_dom_context.document
			return document.querySelector( 'base' ) ? new URL( document.baseURI ).pathname : '/'
		}

		static local( pathname: string ) {
			const base = this.base()
			const path = pathname.startsWith( base ) ? '/' + pathname.slice( base.length ) : pathname
			return path.replace( /(.)\/$/, '$1' )
		}

		@ $mol_mem
		static popstate() {
			return new $mol_dom_listener( this.$.$mol_dom_context, 'popstate', $mol_wire_async( ()=> {
				this.path( this.local( this.$.$mol_dom_context.location.pathname ) )
			} ) )
		}

		@ $mol_mem
		static path( next?: string ) {

			this.popstate()

			const location = this.$.$mol_dom_context.location
			if( next === undefined ) return this.local( location.pathname )

			const target = this.base() + next.replace( /^\//, '' )
			if( target !== location.pathname ) this.$.$mol_dom_context.history.pushState( null, '', target )

			return next
		}

	}

}
