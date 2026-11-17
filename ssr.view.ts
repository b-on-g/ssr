namespace $ {

	export type $bog_ssr_entry = {
		id: string
		name: string
	}

}

namespace $.$$ {

	export class $bog_ssr extends $.$bog_ssr {

		path() {
			return this.$.$bog_ssr_route.path()
		}

		@ $mol_mem
		pages() {

			const path = this.path()

			if( path === '/initial-load' ) return [ this.Initial() ]
			if( path === '/ssr-throughput' ) return [ this.Throughput() ]
			if( path === '/client-side-rendered' ) return [ this.Client() ]
			if( /^\/(client|server)-side-rendered\/[^/]+$/.test( path ) ) return [ this.Detail() ]

			return [ this.Server() ]
		}

		detail_id() {
			return /([^/]+)$/.exec( this.path() )?.[1] ?? ''
		}

		@ $mol_mem
		rows() {
			return this.$.$bog_ssr_rows()
		}

		@ $mol_mem
		client_rows() {
			return Array.from( { length: 1000 }, ()=> ( {
				id: crypto.randomUUID(),
				name: crypto.randomUUID(),
			} ) )
		}

	}

}
