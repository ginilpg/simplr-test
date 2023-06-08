export default {
	brandColor: '#1abc9c',
	phoneNumberErrorMessage : 'only 0-9,- allowed,length must be min 6 and max 13)',
	validateEffectiveToDate : ()=> {
		console.log(Effective_from_date.formattedDate);
		//const result= moment(Effective_to_date.formattedDate) > moment(Effective_from_date.formattedDate);
		//if(!result){
		//	resetWidget("Effective_to_date",false);
		//	showAlert('Effective to date must be greater then Effective from date','error')
		//}
	//	return result;
	}
}