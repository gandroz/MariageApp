function startTime() {
    var today = new Date();
    var end = new Date(2015, 06, 27, 15, 0, 0, 0);
    var diff = dateDiff(today, end);
    document.getElementById('countdown').innerHTML = diff.day + "jours " + diff.hour + "H " + diff.min + "min " + diff.sec + "s";
    t = setTimeout(function () { startTime() }, 500);
}

function dateDiff(date1, date2) {
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
    diff.day = tmp;

    return diff;
}