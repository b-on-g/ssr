namespace $.$$ {

	export class $bog_ssr_table extends $.$bog_ssr_table {

		@ $mol_mem
		row_list() {
			return this.rows().map( ( _, index )=> this.Row( index ) )
		}

		entry_id( index: number ) {
			return this.rows()[ index ].id
		}

		entry_name( index: number ) {
			return this.rows()[ index ].name
		}

		href( index: number ) {
			const base = this.base()
			return base ? base + this.entry_id( index ) : ''
		}

	}

}
