namespace $ {

	export class $bog_ssr_route extends $mol_object {

		@ $mol_mem
		static path( next?: string ) {
			return next ?? '/'
		}

	}

}
