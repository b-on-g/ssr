namespace $ {

	const rows: readonly $bog_ssr_entry[] = Array.from( { length: 1000 }, ()=> ( {
		id: crypto.randomUUID(),
		name: crypto.randomUUID(),
	} ) )

	export function $bog_ssr_rows_load() {
		return new Promise< readonly $bog_ssr_entry[] >( done => setTimeout( ()=> done( rows ), 0 ) )
	}

	export function $bog_ssr_rows( this: $ ) {
		return $mol_wire_sync( this ).$bog_ssr_rows_load()
	}

}
