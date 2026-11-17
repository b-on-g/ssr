namespace $.$$ {

	export class $bog_ssr_table_row extends $.$bog_ssr_table_row {

		cells() {
			return this.href() ? super.cells() : [ this.Id(), this.Name() ]
		}

	}

}
