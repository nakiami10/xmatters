/** 
 * Title: Get Alert by Incident ID
 * @description Get alert information by incident ID.
 *              Copied some parts from preset.
 * 
 * 
 * @author Khirmer Dia <khirmer@beyondgta.com>
 * @version 1.0.2 2022-02-02 Added Alert Ids output
 * 
 */
 const stepTitle = '10_Check_Alerts_by_IncidentId';

 /** Inputs */
 var incidentId = input['Incident ID'];
 
 if (!incidentId) {
     console.log('Incident ID does not exist. Cannot chect incident status');
 }
 
 /** HTTP Request */
 var requestUrl = '/api/xm/1/events?'
                 + 'embed=properties&'
                 + 'sortBy=START_TIME&'
                 + 'status=ACTIVE,SUSPENDED&'
                 + 'sortOrder=ASCENDING&'
                 + 'incidentId='+ incidentId;
 var response = makeAndValidateRequest(requestUrl);
 
 /** Get information */
 var responseCount = response.total;
 
 if (responseCount > 0) {
     var alertData = response.data;
     var alertProp = alertData[0].properties;
     var ticketId = alertProp['Ticket ID'];
 
     var alertIds = [];
     for (var i = 0; i < alertData.length;) {
         alertIds.push(alertData[i].eventId);
     }
     
 } else {
     console.log('No existing alert with incident');
 }
 
 /** Outputs */
 output['Ticket ID'] = ticketId;
 output['Alert IDs'] = alertIds;
 console.log();
 
 /**
 * Http request generator
 */
 function makeAndValidateRequest(path) {
     var request = http.request({
       endpoint: 'xMatters',
       method: 'GET',
       path: path
     });
     var response = request.write();
   
     var error = '';
     try {
       respBody = JSON.parse(response.body);
     } catch (e) {
       error = ': ' + response.body;
     }
     if (response.statusCode >= 200 && response.statusCode < 300) {
       return respBody;
     } else {
       if (respBody && respBody.message) {
         error = ' message: ' + respBody.message;
       }
       var errorReason ='xMatters API returned '
         + '[' + response.statusCode + '] '
         + 'and the following' + error;
       throw new Error(errorReason);
     }
   }
 
   /** END OF SCRIPT */