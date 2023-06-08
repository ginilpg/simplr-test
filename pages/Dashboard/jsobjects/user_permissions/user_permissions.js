export default {
	userPermissions: async () => {
			await postUserPermissions.run( async (res)=>{
			console.log('permission', res);
			await storeValue('p', res);
			set_loading.changeMenu('2');
		}, (e)=>{
			showAlert('Something went wrong! Please try again.', "error")
			console.log('catch: permission API Failed', e)
			navigateTo('Login',{embed: true},'SAME_WINDOW')
		})
	}
}