//global.js 

// Add User
function translateText(event) {


	//Basic validation for text input
    var errorCount = 0;
    $('#text_to_translate input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        var newTextToTranslate = {
            'from_language': $('select#from_language').val(),
            'to_language': $('select#to_language').val(),
            'text': $('input#text_to_translate').val()
        }
		console.log(newTextToTranslate);
		
		//Call service to translate
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newTextToTranslate),
            url: '/translate',
            contentType: "application/json"
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg != '') {

                // Clear the form inputs
                $('span#translated_text').text(response.msg);

            }
            else {

                // If something goes wrong, alert the error message that our service returned
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
	

$(document).ready(function () {
    $('#translate_text button#translate_button').on('click', translateText);
});