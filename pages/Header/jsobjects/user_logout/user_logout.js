export default {
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