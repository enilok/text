//BUSINESS LOGIC
function wordCounter(word) {
    let sentence = word.split(" ")
    const hasLetter = /[A-Za-z]/
    let counter = 0
    for (let index = 0; index < sentence.length; index++) {
        const element = sentence[index]
        if (hasLetter.test(element)) {
            counter++
        }

    }
    return counter
}

function boldedText(text, word) {
    let sentenceword = ""
    let array = text.split(" ")
    array.forEach(function (element, index) {
        if (word.toLowerCase() === element.toLowerCase()) {
            sentenceword = sentenceword.concat("<b>" + element + "</b>");
        } else {
            sentenceword = sentenceword.concat(element)
        }

        if (array.length - 1 !== index) {
            sentenceword = sentenceword.concat(" ");
        }

    })
    return sentenceword
}

//UI
$(document).ready(function () {
     const foulWords = [
        'fuck', 'cunt', 'shit', 'piss', 'asshole', 'bastard', 'bitch', 'damn', 'bollocks',
        'dick', 'prick', 'twat', 'motherfucker', 'cocksucker'
    ];
     const foulWordsRegex = new RegExp(`\\b(${foulWords.join('|')})\\b`, 'gi');
    

    $("#floor").on('input', function () {
        $("#results").show();
        const count = $('#floor').val();
        const wordcount = wordCounter(count);
        $('#word-counter').html(wordcount);

        let text = $(this).val();
        // Count foul words
        const foulMatches = text.match(foulWordsRegex);
        const foulCount = foulMatches ? foulMatches.length : 0;
        $('#foul-counter').html(foulCount);

        // Censor the foul language using the regex
        const processedText = text.replace(foulWordsRegex, (match) => {
            return `<del style=\"color:red;\">${match}</del>`;
        });
        // Update the live preview with the processed text
        $('#live-preview').html(processedText || "Start typing to see the analysis.");
    });

    $("#floor").val("");
    $("#search-input").val("");
    // Select the button and the tool bar
    const floatingButton = $('#floating-button');
    const toolBar = $('#tool-bar');

    // A variable to track if the button is being dragged
    let isDragging = false;
    // Variables to store the initial mouse position and element position
    let initialX;
    let initialY;
    let initialLeft;
    let initialTop;

    // --- Dragging Functionality ---

    // 1. Mouse Down Event: Start the drag
    floatingButton.on('mousedown', function (event) {
        // Only start dragging with the left mouse button (button 0)
        if (event.button !== 0) return;

        isDragging = true;
        // Get the initial mouse position relative to the viewport
        initialX = event.clientX;
        initialY = event.clientY;

        // Get the initial position of the button relative to the document
        initialLeft = floatingButton.offset().left;
        initialTop = floatingButton.offset().top;

        // Prevent the default browser drag behavior
        event.preventDefault();
        // Set the button's position to 'absolute' so we can move it
        floatingButton.css('position', 'absolute');
        // Also set the toolbar's position to absolute
        toolBar.css('position', 'absolute');
    });

    // 2. Mouse Move Event: Update the position while dragging
    $(document).on('mousemove', function (event) {
        if (!isDragging) return;

        // Calculate the difference between the new and initial mouse positions
        let deltaX = event.clientX - initialX;
        let deltaY = event.clientY - initialY;

        // Update the button's position
        const newTop = initialTop + deltaY;
        const newLeft = initialLeft + deltaX;
        floatingButton.css({
            top: newTop,
            left: newLeft
        });
        // If toolbar is visible, move it beside the button
        if (toolBar.hasClass('active')) {
            toolBar.css({
                top: newTop,
                left: newLeft + floatingButton.outerWidth() + 10 // 10px gap
            });
        }
    });

    // 3. Mouse Up Event: End the drag
    $(document).on('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
    });

    // --- Original Click Functionality (with a small change) ---

    // Now, we attach the click event to a dedicated button
    // This allows us to separate dragging from clicking
    floatingButton.on('click', function () {
        // Prevent the click event from firing if the button was just dragged
        // A simple way is to check if it moved by more than a few pixels
        const hasMoved = floatingButton.position().left !== initialLeft || floatingButton.position().top !== initialTop;

        if (!hasMoved) {
            // Only toggle the tool bar if the button was clicked, not dragged
            toolBar.toggleClass('active');
            if (toolBar.hasClass('active')) {
                // Position the toolbar beside the button
                const btnOffset = floatingButton.offset();
                toolBar.css({
                    top: btnOffset.top,
                    left: btnOffset.left + floatingButton.outerWidth() + 10 // 10px gap
                });
            }
        }
    });
    // --- Search Functionality ---
    $('#search-btn').on('click', function () {
        const searchTerm = $('#search-input').val().trim();
        const text = $('#floor').val();


        const bolded = boldedText(text, searchTerm)
        $("#Bolded").html(bolded)

        if (!searchTerm) {
            $('#search-result').html('<span style="color:red">Please enter a word to search.</span>');
            return;
        }
        // Create a regex for whole word, case-insensitive
        const regex = new RegExp('\\b' + searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
        const matches = text.match(regex);
        if (matches && matches.length > 0) {
            $('#search-result').html('Found <b>' + matches.length + '</b> occurrence(s) of "' + searchTerm + '".');
        } else {
            $('#search-result').html('No matches found for "' + searchTerm + '".');
        }
    });


});