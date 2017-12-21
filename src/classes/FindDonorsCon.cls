public with sharing class FindDonorsCon { 
    public class ControllerResponse{
         public String message; 
         public Boolean success; 
    }
     
    ApexPages.StandardController con{get;set;}
    public List<Blood_donor__C>  alldonors{get;set;}
    public String zipSearch{get;set;}
    public String bloodGrp{get;set;}   
    
   //--------new Record creation----------//
    public PageReference newDonor(){
        PageReference page = new PageReference('/a08/e?');
        page.setRedirect(true);
        return page;
    }
     
    
    @AuraEnabled 
    static public  List<Blood_donor__C> findDonors(String bloodGroup,String zip){ 
        system.debug('Inside findDonors '+' '+ bloodGroup +' '+ zip); 
        String bldGrp = bloodGroup.toLowerCase();
         String zipCode = zip;
         
        List<Blood_donor__C> alldonors  =  [SELECT Id,name,First_Name__c,
                                            		Phone_Number__c ,Email_Address__c,
                                                ZipCode__c,Blood_Group__c
                                                FROM Blood_donor__C 
                                                WHERE DISTANCE(Location__c, 
                                                               GEOLOCATION(37.543,-122.234), 'mi') < 20 
                                                AND Blood_Group__c LIKE :bldGrp
                                                ORDER BY DISTANCE(Location__c, GEOLOCATION(37.543,-122.234), 'mi')
                                                LIMIT 10];
       system.debug('filtered donors'+alldonors);
       return alldonors;
    }
    
    @AuraEnabled
    static public   List<Blood_donor__C> fetchAllDonors(){
        List<Blood_donor__C> alldonors  = [Select Id,name,First_Name__c,Phone_Number__c ,ZipCode__c,
                                             Email_Address__c ,Blood_Group__c  
                                           FROM Blood_donor__C limit 10];  
       system.debug ('alldonors'+alldonors);
       return alldonors;
    } 
    
    @AuraEnabled
    static public Boolean sendEmailtoDonors(String bloodGroup,String zip,List<Id> donorIds){ 
        EmailTemplate templ = [SELECT id FROM EmailTemplate 
                                    WHERE developerName = 'BloodDrive'];
        ControllerResponse emailResponse = new ControllerResponse(); 
        Boolean resp = false;
        List<String> emailAdds = new List<String>(); 
        String bloodGrp = bloodGroup;
        String bloodEnquiryEmail = UserInfo.getUserEmail();
        String bloodEnquiryName = UserInfo.getUserName(); 
        //todo create admin as a user and fetch email id
        List<Blood_donor__c> donors = [select id,name,First_Name__c , 
                                       	Email_Address__c 
                                        from Blood_Donor__c 
                                        where id in :donorIds];
        for(Blood_donor__c dr:donors){
            emailAdds.add(dr.Email_Address__c);
        }
        
        emailAdds.add(bloodEnquiryEmail); 
        system.debug('templ'+templ );
        system.debug('emailAdds'+emailAdds ); 
        List<Messaging.SingleEmailMessage> allMessages =
            new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage  smail = new  Messaging.SingleEmailMessage();
                                      smail.setTemplateId(templ.id);
                                      smail.setCcAddresses(emailAdds);
        						      smail.setSenderDisplayName('Save lifes Corp');
                                      smail.setTargetObjectId(UserInfo.getuserid()); 
                                      smail.setSaveAsActivity(false);
        							  smail.setReplyTo(bloodEnquiryEmail); 
                                      smail.setSubject('Looking for  Blood Donors of type : '
                                                      + bloodGrp+' near ' + zip); 
                                      //smail.setHTMLBody(bloodEnquiryName
                                                            // +' looking for  blood donors of type'
                                                            // +bloodGrp+' near ' + zip);
         allMessages.add(smail);
        
         Messaging.SendEmailResult[] results ;
        try{
            results = Messaging.sendEmail(allMessages,false);   
            if (results[0].success) { 
                emailResponse.success = true;
                resp = true;
                emailResponse.message = 'The email was sent successfully.';
            } else {
                emailResponse.success = false;
                emailResponse.message = 'The email failed to send: '+results[0].errors[0].message; 
            } 
        }catch(Exception exe){
            emailResponse.success = false;
            emailResponse.message = 'The email failed to send: '+exe.getMessage();
        }
        system.debug('emailResponse'+emailResponse);
        return resp;
    } 
}