export default {
	brandColor: '#1abc9c',
	red:'#FF6347',
	yellow:'#eed202',
	tenantStatus:{
		active:'Active',
		inactive:'Inactive',
		onboardingFailed:'OnboardingFailed',
		onboardingInitialised:'onboardingInitialised',
	},
	sentenceCase: (str) => {
		var rg = /(^\w{1}|\.\s*\w{1})/gi;
		return str.replace(rg, function(toReplace) {
				return toReplace.toUpperCase();
		});
	}
}