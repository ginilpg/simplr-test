export default {
	saveToken: async () => {
		// Check if there is code query param in the URL
		if (appsmith.URL.queryParams.a_token) {
			await storeValue('a_token', appsmith.URL.queryParams.a_token)
			await storeValue('email', appsmith.URL.queryParams.email)
			navigateTo('Dashboard',{embed: true},'SAME_WINDOW')
			await user_permissions.userPermissions();
		}else if(appsmith.store.a_token){
			set_loading.changeMenu('2')
		}else {
			showAlert('Session has expired, please login again', "error")
			console.log('Session has expired')
			navigateTo('Login',{embed: true},'SAME_WINDOW')
		}
	}
}