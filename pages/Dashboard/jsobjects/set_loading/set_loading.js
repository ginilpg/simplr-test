export default {
	changeMenu: (id) => {
		storeValue('menuLoading', id, false);
	},
	getMenu: () => {
		return appsmith.store.menuLoading ?? 1;
	}
}