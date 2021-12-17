$(document).ready(() => {
    // Get all Buttons
    var quickAddBtn = document.getElementById("AddBtnDropdown");
    var AddBtn = document.getElementById("Add");
    var cancelBtn = document.getElementById("Cancel");

    // Extract Form Zones
    var name = document.getElementById("name");
    var surname = document.getElementById("surname");
    var phone = document.getElementById("phone");
    var address = document.getElementById("address");
    var search = document.getElementById("search");

    //Extra selectors
    var Sorter = document.querySelector(".dropdown");

    // Empty Storage Array
    var contacts = [];

    // Event Listeners
    quickAddBtn.addEventListener("click", () => {
        //ADD Toggle
        $(".mainContainer").fadeToggle("slow");
    });

    cancelBtn.addEventListener("click", () => {
        //Cancel button
        $(".mainContainer").fadeOut("slow");
    });

    function JsonContactGenerator(name, surname, phone, address, id) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.address = address;
        this.id = id;
        // this.id = (id)=>{
        //   id
        // }
    }

    function Counter() {
        var count = 0;
        return function counting() {
            count++;
            return count;
        };
    }

    var count = Counter();

    // When AddButton has been pressed,
    // 1. Validate
    // 2. If filled correctly, Collect and store in local storage
    // 3. Clear form fields

    /////////// ADD Submit listener  ///////////

    AddBtn.addEventListener("click", addContactfunc);

    function addContactfunc() {
        var x = name.value != "" && surname.value != "" && phone.value != "" && address.value != "" ? true : false;

        if (!x) {
            window.alert("Please fill up all input fields!!");
        } else if (!Number.isInteger(parseInt(phone.value)) || phone.value.length < 5) {
            window.alert("Numbers only! Please enter at least 5 numbers");
        } else {
            var NewContactJson = new JsonContactGenerator(
                name.value,
                surname.value,
                phone.value,
                address.value,
                count(),
            );
            contacts.push(NewContactJson);

            localStorage["newContact"] = JSON.stringify(contacts);

            // clear forms afterwards
            $(".inputFields").val("");

            //show contacts
            ShowContacts();
            console.log("finished");

            console.log(localStorage["newContact"]);
        }
    }

    ///// ShowContacts function /////////////////////

    function ShowContacts() {
        if (localStorage["newContact"] === undefined) {
            localStorage["newContact"] = "";
        } else {
            contacts = JSON.parse(localStorage["newContact"]);

            $(".addcontact").html("");

            //populate addcontact from JS
            for (let i = 0; i < contacts.length; i++) {
                $(".addcontact").append(`<div class="entry">
                    <div class="namee row"><p>${contacts[i]["name"]}</p></div>
                    <div class="emaile row"><p>${contacts[i]["surname"]}</p></div>
                    <div class="phonee row"><p>${contacts[i]["phone"]}</p></div>
                    <div class="addresse row"><p>${contacts[i]["address"]}</p></div>
                    <div class="select"><i class="fas fa-trash del" data-id="${i}"></i></div>`);
            }
        }
    }

    ShowContacts();

    ///// Deleter/////////////////////

    $(".contactsContainer").on("click", (e) => {
        //e.preventdDefault()

        //console.log(e.target.classList);
        if (e.target.classList.contains("del")) {
            let id = e.target.getAttribute("data-id");
            console.log(id);
            console.log(contacts);
            contacts.splice(id, 1);
            console.log(contacts);
            localStorage["newContact"] = JSON.stringify(contacts);
        }
        ShowContacts();
    });

    // Sorter   /////////////////////////

    Sorter.addEventListener("change", (e) => {
        // console.log(Sorter.value);
        console.log(contacts);

        if (Sorter.value === "ascending") {
            contacts = contacts.sort((a, b) =>
                a["name"].toLowerCase().slice(0, 1) > b["name"].toLowerCase().slice(0, 1) ? 1 : -1,
            );
            //console.log(contacts.map((a, b) => a["name"].slice(0, 1)));
        } else if (Sorter.value === "descending") {
            contacts = contacts.sort((a, b) =>
                a["name"].toLowerCase().slice(0, 1) > b["name"].toLowerCase().slice(0, 1) ? -1 : 1,
            );
        } else if (Sorter.value === "byDate") {
            contacts = contacts.sort((a, b) => (Number(a["id"]) > Number(b["id"]) ? 1 : -1));
        }
        localStorage["newContact"] = JSON.stringify(contacts);
        ShowContacts();
    });

    ///// Searcher //

    $("#search").on("keyup", (e) => {
        e.preventDefault();

        console.log(e.target.value.toLowerCase());
        //console.log($(`.entry:nth-child(${x+1})`));

        //let rowArray = document.querySelectorAll(".entry")[0].innerText.toLowerCase().split(/[\n]+/)

        let entries = document.querySelectorAll(".entry");
        $(".entry").show();

        for (let i = 0; i < entries.length; i++) {
            let rowArray = entries[i].innerText.toLowerCase().split(/[\n]+/);
            let re = new RegExp(`^${e.target.value.toLowerCase()}`); //Regex to test match for starting letters

            if (!rowArray.some((a) => re.test(a))) {
                $(`.entry:nth-child(${i + 1})`).hide(); //
            }
        }
    });
});
