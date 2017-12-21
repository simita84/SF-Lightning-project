({
	allDonors      : function(component) {
         var bloodTypes =   [
            { value: "O+", label: "O+" },
            { value: "B+", label: "B+" },
            { value: "A+", label: "A+" }
         ]; 
        component.set("v.bloodTypes",bloodTypes);
        //---Reset-----
        component.set("v.statusMsg",null);
		var action = component.get("c.fetchAllDonors");
        action.setCallback(this, function(data) {
            debugger;
            var donors = data.getReturnValue();
            console.log('defaultDonors', donors);
        	component.set("v.donors",donors);
        });
        
       
        $A.enqueueAction(action); 
    },
    filterDonors   : function(component,event){
        component.set("v.donors",null);
        //---Reset-----
        debugger;
       component.set("v.statusMsg",null);
        var ev = event.getSource();
        console.log('event',ev);
        var action = component.get("c.findDonors");
        var bloodGrp = component.get("v.bgrp").trim().toLowerCase();
        console.log('bloodGrp'+bloodGrp);
        action.setParams(
            {
                bloodGroup:bloodGrp,
                zip:component.get("v.zip")
            }
        );  
        action.setCallback(this, function(response) {
            var state = response.getState();
            var donors = response.getReturnValue();
            if (state === "SUCCESS") { 
				if(donors.length>0){
              		component.set("v.donors",donors);  
            	}else{
               	   component.set("v.statusMsg",'No donors found !!!');
                } 
            }
            else if (state === "INCOMPLETE") {
               
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        component.set("v.statusMsg",errors[0].message);
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                    component.set("v.statusMsg","Unknown error");
                }
            }
        }); 
        $A.enqueueAction(action); 
    },
    emailDonors    : function(component,event){
        
        var target = event.getSource();
        var donorIds = [];
        donorIds.push(target.get("v.value"));
        debugger; 
        var bloodGrp = component.get("v.bgrp"); 
        var zipC     = component.get("v.zip") ;
       
        if(zipC==null ||bloodGrp==null ){
            component.set("v.statusMsg",'Please enter valid inputs');
        }else{ 
            component.set("v.statusMsg",null);
            bloodGrp = bloodGrp.trim(); zipC = zipC.trim();
            var action = component.get("c.sendEmailtoDonors");
            action.setParams(
                {
                  bloodGroup:bloodGrp,
                  zip:zipC,
                  donorIds:donorIds
                }
            );
            action.setCallback(this,function(data){  
                var message = data.getReturnValue(); 
                debugger;
                if(data.getState()){
                    console.log('email sent ',message);  
                    if(message == true){
                         component.set("v.statusMsg",'Email Sent!!!');
                    }else{
                        component.set("v.statusMsg",'Cannot send email, bad response');
                    }
                }
                 
            });
            $A.enqueueAction(action);
        } 
    },
    createDonor    : function (component, event, helper) {
       var createDonorEvent = $A.get("e.force:createRecord");
        createDonorEvent.setParams({
            "entityApiName": "Blood_Donor__c"
        });
        createDonorEvent.fire();
    },
    gotoBloodDonorHome : function (component, event, helper) {
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "Blood_Donor__c"
        });
    homeEvent.fire();
    },
    modifyDonor    :function (component, event, helper){
        var editEvent = $A.get("e.force:editRecord");
        var donorId   = event.getSource().get("v.value"); 
        editEvent.setParams({
         "recordId": donorId
   		});
    	 editEvent.fire(); 
    }

})