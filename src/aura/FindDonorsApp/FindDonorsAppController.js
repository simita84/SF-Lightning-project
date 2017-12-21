({
	allDonors:function(component) {
        //---Reset-----
        component.set("v.statusMsg",null);
		var action = component.get("c.fetchAllDonors");
        action.setCallback(this, function(data) {
            debugger;
            var donors = data.getReturnValue();
            console.log('defaultDonors', donors);
        	component.set("v.donors",donors);
        });
        
        var bloodTypes = [{class:"optionClass",label:"B+",value:"B+"},
                          {class:"optionClass",label:"B-",value:"B-"},
                          {class:"optionClass",label:"A+",value:"A+"},
                          {class:"optionClass",label:"A-",value:"A-"},
                          {class:"optionClass",label:"O+",value:"O+"} ,
                          {class:"optionClass",label:"O-",value:"O-"}];
        component.find("BloodGroup").set("v.options",bloodTypes);
        $A.enqueueAction(action); 
    },
    filterDonors : function(component,event){
        //---Reset-----
        debugger;
       component.set("v.statusMsg",null);
        var ev = event.getSource();
        console.log('event',ev);
        var action = component.get("c.findDonors");
        action.setParams({bloodGroup:component.get("v.bgrp"),zip:component.get("v.zip")}); 
        
        action.setCallback(this, function(response) {
            var state = response.getState();
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
    emailDonor : function(component,event){
        debugger;
        component.set("v.statusMsg",null);
        var action = component.get("c.sendEmailtoDonors");
            action.setParams(
                {
                  bloodGroup:component.get("v.bgrp"),
                  zip:component.get("v.zip")
                }
            );
            action.setCallback(this,function(response){  
                var message = data; 
                debugger;
                if(data.getState()){
                    console.log('email sent ',message);  
                    if(message == true){
                         component.set("v.statusMsg",'Email Sent');
                    }else{
                        component.set("v.statusMsg",'Bad Response');
                    }
                }
                 
            });
            $A.enqueueAction(action);
    }
})