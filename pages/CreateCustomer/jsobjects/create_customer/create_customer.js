export default {
	joinFields:(fields=[])=>{
		const totalFields = fields.length;
		let joined = "";
		for(let i = 0; i< totalFields; i++){
			if(totalFields>1 && i===totalFields-1){
				joined += ` and ${fields[i]}`;
			}else{
				joined += `${i>0?', ':''}${fields[i]}`;
			}
		}
		return joined;
	},
	createCustomer : async () => {
		let array1 = core_checkbox.selectedValues;
		let array2 = recog_checkbox.selectedValues;
		let array3 = news_checkbox.selectedValues;
		let array4 = video_checkbox.selectedValues;
		let array5 = sentiment_ai_checkbox.isChecked ? 5 : []
		//console.log("array3", array3)
		array1 = array1.concat(array2, array3, array4, array5)
		let featuresList = array1.map((item) => { 
			return { features_id:item}
		});
		//console.log("featuresList", featuresList)
		let formData = {
			subdomain_name: `${subdomainName_txt.text}${domain_name_postfix.text}`,
			//data_centers_id: 1,
			account_type_id: parseInt(instance_type.selectedOptionValue),
			//mobile_app_category: mobile_app_category.selectedOptionValue,
			display: {
				company_display_name: customer_name.text,
				timezone: customer_timezone.selectedOptionValue,
				language_id: parseInt(customer_language.selectedOptionValue),
				locale_id: customer_locale.selectedOptionValue
			},
			primary_contact: {
				first_name: primary_contact_first_name.text,
				last_name: primary_contact_last_name.text,
				email: primary_contact_email.text,
				//phone_code: primary_contact_phonecode.selectedOptionValue,
				phone: primary_contact_phonenumber.text,
				//mobile_code: primary_contact_officecode.selectedOptionValue,
				mobile: primary_contact_officenumber.text
			},
			instance_admin_user: {
				first_name: app_manager_first_name.text,
				last_name: app_manager_last_name.text,
				email: app_manager_email.text,
				//phone_code: app_manager_phonecode.selectedOptionValue,
				phone: app_manager_phonenumber.text,
				//mobile_code: app_manager_officecode.selectedOptionValue,
				mobile: app_manager_officenumber.text,
				timezone: app_manager_timezone.selectedOptionValue,
				language_id: parseInt(app_manager_language.selectedOptionValue),
				locale_id: app_manager_locale.selectedOptionValue
			},
			license: {
				features: featuresList,
				platform: parseInt(license_count.text),
				service_start_date: Effective_from_date.formattedDate,
				service_end_date: Effective_from_date.formattedDate,
				contract_duration: parseInt(contract_duration.selectedOptionValue)
			}
		}
		console.log(formData)
				// Primary contact: Processing start
		const PRIMARY_CONTACT_FIELD_NAMES = {
			first_name: "first name",
			last_name: "last name",
			email: "email",
		};
		
		const primaryContactEmptyFields = Object.entries(formData.primary_contact).
		filter(([key, value])=>PRIMARY_CONTACT_FIELD_NAMES.hasOwnProperty(key) &&  value.length===0).
		map(([key])=>PRIMARY_CONTACT_FIELD_NAMES[key]);

		if (primaryContactEmptyFields.length===Object.entries(PRIMARY_CONTACT_FIELD_NAMES).length) {
			delete formData.primary_contact;
			if(formData.instance_admin_user.phone.length == 0){
				delete formData.instance_admin_user.phone;
			}
		}else{
			showAlert(`Please enter a valid value for ${this.joinFields(primaryContactEmptyFields)} under primary contact`);
			return;
		}
		// Primary contact: Processing ends

		storeValue("searchByLabel", "Subdomain name")
		storeValue("searchByValue", "subdomain")
		storeValue('searchText', subdomainName_txt.text);

		if(instance_type.selectedOptionValue === 1){
			console.log("Create Customer", formData)
			await createCustomerApi.run((msg)=>{
				showAlert(msg.message, "success")
				navigateTo('CustomerList',{ embed: true });
			}, (e)=>{
				showAlert(e.errors[0].message, "error");
			}, {formData});	
		}else{
			delete formData.data_centers_id;
			delete formData.account_type_id;
			if(demo_instance_type.selectedOptionValue != "1"){
				formData = {
					source_account_id : demo_instance_type.selectedOptionValue,
					subdomain_name: `${subdomainName_txt.text}${domain_name_postfix.text}`,
					display: {
						company_display_name: customer_name.text,
						timezone: customer_timezone.selectedOptionValue,
						language_id: parseInt(customer_language.selectedOptionValue),
						locale_id: customer_locale.selectedOptionValue
					}
				}
			}
			console.log("Create Demo Customer", formData)
			await createDemoCustomer.run((msg)=>{
				showAlert(msg.message, "success")
				navigateTo('CustomerList',{ embed: true });
			}, (e)=>{
				showAlert(e.errors[0].message, "error");
			}, {formData});	
		}
	},
	getExistingDemoAccounts: () => {
		let obj = getDemoAccountList.data.map(item => { return { label:item.subdomain_name, value:item.account_id}})
		obj.unshift({label: "Blank Instance", value: "1"})
		return obj
	},
	getManageFeature: () => {
		let obj = getFeatureList.data.map(item => {
			return { "label": item.name, "value": item.id}
		})
		obj.shift() // remove core from list
		// obj = obj.filter(function( obj ) {
		// return obj.label !== "Sentiment AI";
		// });
		return obj
	},
	validateSubdomain : async () => {
		const {name_exists} = await subdomainValidation.run(
			//()=>{},
			//(e)=>{
			//	showAlert(e.errors[0].message, "error");
			//}
		)
		if(!name_exists){
			await storeValue('domainValidation',true)
		}else{
			await storeValue('domainValidation',false)
		}
	},
	debounce : (fn,delay=300)=>{
		let timer;
		(function some(){
			if(timer){
				clearTimeout(timer)
			}
			timer = setTimeout(()=>{
				fn();
			},delay)
		})()
	},
}