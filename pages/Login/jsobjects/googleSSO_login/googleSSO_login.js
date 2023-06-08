export default {
	googleLogin : async () => {
		await getSSOLogin.run(({url})=>{
			navigateTo(url,{}, "SAME_WINDOW");
		}, (e)=>{
			console.log("getSSOLogin", e)
			storeValue('statusCode', getSSOLogin.responseMeta.statusCode)
			common_utils.error401()
		});			
	}
}