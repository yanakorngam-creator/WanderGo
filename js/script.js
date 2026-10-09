/* =========================================
   WanderGo
   Global JavaScript
   ========================================= */


/* =========================================
   Storage Keys
   ========================================= */

const USER_KEY = "wanderGoUser";
const LOGIN_KEY = "wanderGoLoggedIn";
const TRIPS_KEY = "wanderGoTrips";
const FAVORITES_KEY = "wanderGoFavorites";


/* =========================================
   User System
   ========================================= */

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(USER_KEY)
        ) || null;

    } catch (error) {

        console.error(
            "Cannot read user data:",
            error
        );

        return null;
    }
}


function saveCurrentUser(user) {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );
}


function loginUser(email, name) {

    const user = {

        name:
            name ||
            email.split("@")[0],

        email: email,

        bio: "",

        createdAt:
            new Date().toISOString()
    };


    saveCurrentUser(user);


    localStorage.setItem(
        LOGIN_KEY,
        "true"
    );


    return user;
}


function isLoggedIn() {

    return (
        localStorage.getItem(
            LOGIN_KEY
        ) === "true"
    );
}


function logout() {

    localStorage.removeItem(
        LOGIN_KEY
    );


    window.location.href =
        "index.html";
}


function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "index.html";

        return false;
    }


    return true;
}


/* =========================================
   Trip System
   ========================================= */

function getTrips() {

    try {

        const data =
            localStorage.getItem(
                TRIPS_KEY
            );


        if (!data) {

            return [];
        }


        const trips =
            JSON.parse(data);


        return Array.isArray(trips)
            ? trips
            : [];

    } catch (error) {

        console.error(
            "Cannot read trips:",
            error
        );

        return [];
    }
}


/* -----------------------------------------
   Save Trips
   ----------------------------------------- */

function saveTrips(trips) {

    localStorage.setItem(
        TRIPS_KEY,
        JSON.stringify(trips)
    );
}


/* -----------------------------------------
   Generate Trip ID
   ----------------------------------------- */

function generateId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


/* -----------------------------------------
   Add Trip
   ----------------------------------------- */

function addTrip(trip) {

    const trips =
        getTrips();


    const newTrip = {

        id:
            trip.id ||
            generateId(),

        tripName:
            trip.tripName ||
            "ทริปใหม่",

        destination:
            trip.destination ||
            "",

        province:
            trip.province ||
            "",

        country:
            trip.country ||
            "ประเทศไทย",

        startDate:
            trip.startDate ||
            "",

        endDate:
            trip.endDate ||
            "",

        totalCost:
            Number(
                trip.totalCost
            ) || 0,

        travelers:
            Array.isArray(
                trip.travelers
            )
                ? trip.travelers
                : [],

        places:
            Array.isArray(
                trip.places
            )
                ? trip.places
                : [],

        expenses:
            Array.isArray(
                trip.expenses
            )
                ? trip.expenses
                : [],

        details:
            trip.details ||
            "",

        createdAt:
            new Date().toISOString()
    };


    trips.push(
        newTrip
    );


    saveTrips(
        trips
    );


    return newTrip;
}


/* -----------------------------------------
   Get Trip By ID
   ----------------------------------------- */

function getTripById(tripId) {

    return getTrips().find(
        function(trip) {

            return (
                String(trip.id) ===
                String(tripId)
            );

        }
    ) || null;
}


/* -----------------------------------------
   Update Trip
   ----------------------------------------- */

function updateTrip(
    tripId,
    updates
) {

    const trips =
        getTrips();


    const index =
        trips.findIndex(
            function(trip) {

                return (
                    String(trip.id) ===
                    String(tripId)
                );

            }
        );


    if (index === -1) {

        return null;
    }


    trips[index] = {

        ...trips[index],

        ...updates
    };


    saveTrips(
        trips
    );


    return trips[index];
}


/* -----------------------------------------
   Delete Trip
   ----------------------------------------- */

function removeTrip(tripId) {

    const trips =
        getTrips();


    const filteredTrips =
        trips.filter(
            function(trip) {

                return (
                    String(trip.id) !==
                    String(tripId)
                );

            }
        );


    saveTrips(
        filteredTrips
    );
}


/* =========================================
   Budget System
   ========================================= */

function calculateExpenses(
    expenses = []
) {

    return expenses.reduce(
        function(total, expense) {

            return (
                total +
                (
                    Number(
                        expense.amount
                    ) || 0
                )
            );

        },
        0
    );
}


function calculateTripCost(trip) {

    if (!trip) {

        return 0;
    }


    const base =
        Number(
            trip.totalCost
        ) || 0;


    const expenses =
        calculateExpenses(
            trip.expenses || []
        );


    return base + expenses;
}


/* =========================================
   Money
   ========================================= */

function formatMoney(amount) {

    return (
        Number(amount) || 0
    ).toLocaleString(
        "th-TH"
    ) + " ฿";
}


/* =========================================
   Date
   ========================================= */

function formatDate(date) {

    if (!date) {

        return "-";
    }


    const d =
        new Date(date);


    if (
        Number.isNaN(
            d.getTime()
        )
    ) {

        return "-";
    }


    return d.toLocaleDateString(
        "th-TH",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================
   Favorites
   ========================================= */

function getFavorites() {

    try {

        const data =
            localStorage.getItem(
                FAVORITES_KEY
            );


        if (!data) {

            return [];
        }


        const favorites =
            JSON.parse(data);


        return Array.isArray(
            favorites
        )
            ? favorites
            : [];

    } catch (error) {

        console.error(
            "Cannot read favorites:",
            error
        );

        return [];
    }
}


function saveFavorites(
    favorites
) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(
            favorites
        )
    );
}


function isFavorite(placeId) {

    return getFavorites().some(
        function(place) {

            return (
                String(place.id) ===
                String(placeId)
            );

        }
    );
}


function toggleFavorite(place) {

    const favorites =
        getFavorites();


    const index =
        favorites.findIndex(
            function(item) {

                return (
                    String(item.id) ===
                    String(place.id)
                );

            }
        );


    if (index >= 0) {

        favorites.splice(
            index,
            1
        );

    } else {

        favorites.push(
            place
        );
    }


    saveFavorites(
        favorites
    );


    return favorites;
}


/* =========================================
   Security
   ========================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================
   Toast Message
   ========================================= */

function showToast(message) {

    const toast =
        document.createElement(
            "div"
        );


    toast.textContent =
        message;


    toast.style.position =
        "fixed";

    toast.style.left =
        "50%";

    toast.style.bottom =
        "25px";

    toast.style.transform =
        "translateX(-50%)";

    toast.style.background =
        "#12344d";

    toast.style.color =
        "#ffffff";

    toast.style.padding =
        "12px 20px";

    toast.style.borderRadius =
        "12px";

    toast.style.fontSize =
        "14px";

    toast.style.fontWeight =
        "600";

    toast.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.18)";

    toast.style.zIndex =
        "9999";


    document.body.appendChild(
        toast
    );


    setTimeout(
        function() {

            toast.remove();

        },
        2500
    );
}
async function testSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .limit(1);

        if (error) {
            console.error("Supabase error:", error.message);
            alert("เชื่อมต่อแล้ว แต่ต้องตรวจสอบตาราง profiles หรือสิทธิ์การเข้าถึง");
            return;
        }

        console.log("เชื่อมต่อ Supabase สำเร็จ!");
        alert("เชื่อมต่อ Supabase สำเร็จ!");
    } catch (err) {
        console.error(err);
        alert("เชื่อมต่อไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า");
    }
}
