export default {
	onLoad: async () => {	
		await ListAllTimezones.run(()=>{},()=>{
			storeValue('statusCode', ListAllTimezones.responseMeta.statusCode)
			common_utils.error401()
		})
		await storeValue('searchByLabel', undefined)
		await storeValue('searchByValue', undefined)
		await storeValue('searchStatus', undefined)
		await storeValue('searchText', undefined)
	},
	matchPermission : (permissions) => {
		let match = false;
		const permissionsArr = Array.isArray(permissions) ? permissions : [permissions];
		if (permissionsArr.length === 0) {
			match = false;
		} else {
			let userPermissions = []; 
			userPermissions =	appsmith.store.p;
			match = permissionsArr.some(
				(p) => userPermissions && userPermissions.includes(p)
			);
		}
		return match;
	},
	error401: () => {
		if (appsmith.store.statusCode === "401 UNAUTHORIZED" || appsmith.store.statusCode === "403 FORBIDDEN") {
			showAlert("Session has expired, please login again.", "error")
			navigateTo('Login',{ embed: true });
		}
	},
	logout: async () => {
		try{
			const {message} = await postLogout.run();
			if(message === 'SUCCESS'){
				await storeValue('a_token',undefined);
				navigateTo('Login',{ embed: true });
			}
		}
		catch{
				await storeValue('a_token',undefined);
				navigateTo('Login',{ embed: true });
		}
	}
}