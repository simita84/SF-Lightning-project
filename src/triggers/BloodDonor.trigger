trigger BloodDonor on Blood_Donor__c (after insert, after update ) {  
    
    for(Blood_Donor__c donor:Trigger.new){
        
        Boolean addressesChanged = false;
        //check if the addresses has chnaged in update trigger
       
        if(Trigger.isUpdate){
          Blood_Donor__c oldDonorRec = Trigger.oldMap.get(donor.id);
            if( oldDonorRec.Street__c != donor.Street__c ||
                oldDonorRec.City__c != donor.City__c ||
                oldDonorRec.State__c != donor.State__c ||
                oldDonorRec.Country__c != donor.Street__c||
                oldDonorRec.ZipCode__c != donor.ZipCode__c  ){
                    addressesChanged = true;
            }
        }
        //--- If the address has changes or it is a new record, populate the Location__c
        if(Trigger.isUpdate && addressesChanged == true ||  Trigger.isInsert){
            LocationCallouts.getAddressGeocode(donor.id);
        }
        
    }   
        
    
}