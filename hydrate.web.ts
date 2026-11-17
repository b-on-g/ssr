namespace $ {

	const external = $mol_view.prototype.dom_node_external

	$mol_view.prototype.dom_node_external = function( this: $mol_view, next?: Element ) {
		return external.call( this, next ?? this.$.$mol_dom_context.document.getElementById( this.dom_id() ) ?? undefined )
	}

}
