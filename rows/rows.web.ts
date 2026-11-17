namespace $ {

	export function $bog_ssr_rows( this: $ ): readonly $bog_ssr_entry[] {

		const state = this.$mol_dom_context.document.getElementById( 'bog_ssr_rows' )
		if( state ) return JSON.parse( state.textContent ?? '[]' )

		return this.$mol_fetch.json( 'rows' ) as $bog_ssr_entry[]
	}

}
