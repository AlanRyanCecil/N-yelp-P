var divElement = document.getElementById('viz1544768069447');
var vizElement = divElement.getElementsByTagName('object')[0];
vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*0.75)+'px';
var scriptElement = document.createElement('script');
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
vizElement.parentNode.insertBefore(scriptElement, vizElement);

$('#dropdownMenuLink').on('click', function() {
    $('#tableaublock').hide('slow');
    $('#contentblock').slideDown('slow');
    world.invalidateSize();
});

$("#totableau").on('click', function() {
    $('#tableaublock').show('slow');
    $('#contentblock').hide('slow');
})