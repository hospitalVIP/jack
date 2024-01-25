var e;
e = function() {
    let e, t, n, o, a, i, s, r, c = "./models/", l = "models/textures/", d = "models/materials/", m = "sounds/", u = "videos/", p = "gifs/", E = "environment/", h = "de";
    const T = ["Instagram", "LinkedInApp", "MessengerForiOS", "MessengerLiteForiOS"]
      , O = ["ar.poodltoken.com"];
    let I, g, C, A, N, b, f = {
        android: "",
        ios: ""
    }, R = {
        interactedWithCameraView: void 0,
        lastClickedHotspot: void 0
    }, y = !1, L = !1, v = {
        EXPOSURE: .5,
        METALLIC: 1.3,
        ROUGHNESS: .9,
        FIELD_OF_VIEW: "auto",
        MAX_FIELD_OF_VIEW: "auto",
        MIN_FIELD_OF_VIEW: "25deg",
        PRODUCT_SELECTOR_TYPE: "normal",
        BTN_COLOR: "blue",
        TEXTURE_SELECTOR_TYPE: "normal",
        CALL_TO_ACTION_TYPE: "none",
        HIDE_CALL_TO_ACTION_3D: !1,
        HIDE_CALL_TO_ACTION_AR: !1,
        INTEGRATION_ACTIVE: !1,
        GLASS_TRY_ON: !1,
        TEXTURE_NAMING: "dynamic",
        VIEWER_SET: "quick-look webxr scene-viewer",
        AR_SCALE_MODE: "auto",
        BASE_PATH: "",
        DISABLE_IMPRESSION_TRACKING: !1,
        LOADING_TIME_MS: 3e3,
        BROWSER_CHECK_ACTIVE: !0,
        USDZ_CONVERSION_INTEGRATED: !1,
        COLOR_ANIMATION: !1,
        EDITOR_ACTIVE: !1
    }, w = {
        cameraTarget: "",
        cameraOrbit: "",
        minCameraOrbit: ""
    }, S = [], _ = "https://dwkpx86rtc.execute-api.eu-central-1.amazonaws.com/pro/", x = "https://api.mazing-ar.com/convert/", U = "https://" + document.location.host + "/", M = !1, G = _ + "get-project/", k = _ + "insert-impression/", F = _ + "insert-maintenance/", D = _ + "insert-experience/", P = _ + "web3-user-nonce/", B = _ + "web3-fetch-sign/", H = _ + "cors-proxy/", V = "https://glass.mazing.link/", j = (new Date).getTime() + "X", z = (new Date).getTime() + "X", W = [], q = [], X = [], J = [], Y = !1, $ = !1;
    const Z = {
        selectProduct: {
            de: "Produkt wählen:",
            en: "Select Product:",
            cs: "Vybrat produkt"
        },
        selectTextureDropdown: {
            de: "Produkt wählen:",
            en: "Select Product:",
            cs: "Vybrat produkt"
        },
        selectColor: {
            de: "Farbe wählen:",
            en: "Select Color:",
            cs: "Vybrat barvu"
        },
        selectTexture: {
            de: "Textur wählen:",
            en: "Select Texture:",
            cs: "Vybrat látku"
        },
        qrInfo: {
            de: "Um das Erlebnis zu starten, bitte den QR-Code mit der Smartphone-Kamera scannen!",
            en: "To start the experience. Please scan the QR Code with your smartphone camera!",
            cs: "Abyste mohli produkt vidět v AR, naskenujte prosím QR kód vaším chytrým telefonem"
        },
        webXrMovement: {
            de: "Smartphone bewegen um Objekt zu platzieren",
            en: "Move your phone to place the object",
            cs: "Nasměrujte váš telefon na místo, kde chcete produkt zobrazit"
        },
        loadingAR: {
            de: "Dein AR Erlebnis wird vorbereitet ...",
            en: "We are preparing your experience ...",
            cs: "Vteřinku! Spouštíme pro vás rozšířenou realitu..."
        },
        loadingAutoStart: {
            de: "Dein AR Erlebnis wird vorbereitet ...",
            en: "We are preparing your experience ...",
            cs: "Vteřinku! Spouštíme pro vás rozšířenou realitu"
        },
        userRequestTextAutoStart: {
            de: "Jetzt AR Erlebnis starten ...",
            en: "Start your AR experience now ...",
            cs: "Vyzkoušejte rozšířenou realitu nyní..."
        },
        userRequestBtnAutoStart: {
            de: "HIER KLICKEN",
            en: "CLICK HERE",
            cs: "KLIKNĚTE ZDE"
        },
        userRequestIntroLoginMetamask: {
            de: "Jetzt 3D/AR Erlebnis starten ...",
            en: "Start your 3D/AR experience now ...",
            cs: "Vyzkoušejte rozšířenou realitu nyní..."
        },
        userRequestBtnLoginMetamask: {
            de: "LOGIN MIT METAMASK",
            en: "LOGIN WITH METAMASK",
            cs: "LOGIN WITH METAMASK"
        },
        metaMaskWaitText: {
            de: "Jetzt Metamask öffnen und Anfrage signieren!",
            en: "Open Metamask now and sign request!",
            cs: "Open Metamask now and sign request!"
        },
        web3Errors: {
            OWNERSHIP_NOT_MATCHING: {
                hint: {
                    de: "Du bist nicht der Besitzer dieses NFTs. Kaufe es auf Opensea!",
                    en: "You are not the owner of this NFT. Buy it on Opensea!",
                    cs: "You are not the owner of this NFT. Buy it on Opensea!"
                },
                action: {
                    de: "GEHE ZU OPENSEA",
                    en: "BUY ON OPENSEA",
                    cs: "BUY ON OPENSEA"
                }
            },
            METAMASK_NOT_INSTALLED: {
                hint: {
                    de: "Metamask ist nicht installiert. Installiere es jetzt!",
                    en: "MetaMask is not installed. Install it now!",
                    cs: "MetaMask is not installed. Install it now!"
                },
                action: {
                    de: "INSTALLIEREN",
                    en: "INSTALL NOW",
                    cs: "INSTALL NOW"
                }
            },
            ACTION_BACK: {
                de: "ZURÜCK",
                en: "GO BACK",
                cs: "GO BACK"
            }
        },
        loadingUSDZ: {
            de: "Bitte warten! AR Erlebnis wird geladen ...",
            en: "Please wait! Your AR experience is starting ...",
            cs: "Vteřinku! Spouštíme pro vás rozšířenou realitu... "
        },
        scrollHintPc: {
            de: "SHIFT + Mausrad für Zoom",
            en: "SHIFT + mouse wheel to zoom",
            cs: "SHIFT + pootočte kolečko na myši k přiblížení"
        },
        scrollHintIos: {
            de: "⌥  +  Mausrad für Zoom",
            en: "⌥  +  mouse wheel to zoom",
            cs: "⌥ + pootočte kolečko na myši k přiblížení"
        },
        supportedDevicesHint: {
            de: "iOS 13+, iPadOS 13+ oder Android mit ARCore 1.9+ benötigt",
            en: "iOS 13+, iPadOS 13+ or Android with ARCore 1.9+ required",
            cs: "AR podporováno pro iOS 13+, iPadOS 13+ nebo Android s ARCore 1.9+"
        },
        arFailed: {
            de: "Sorry, dein Smartphone unterstützt Augmented Reality aktuell noch nicht ...",
            en: "Sorry, your phone does not support Augmented Reality at the moment ...",
            cs: "Omlouváme se, ale váš telefon není vhodný pro rozšířenou realitu ..."
        },
        arViewWorld: {
            de: "Sorry, für AR musst du dein Projekt zuerst speichern ...",
            en: "Sorry, for AR you need to save your project first ...",
            cs: "Omlouváme se, ale pro AR musíte svůj projekt nejprve uložit ..."
        },
        unsupportedBrowserHeadline: {
            de: "Der {browser} Browser unterstützt Augmented Reality noch nicht ...",
            en: "Sorry, the {browser} browser does not support Augmented Reality yet...",
            cs: "Omlouváme se, ale váš prohlížeč zatím nepodporuje rozšířenou realitu ..."
        },
        unsupportedBrowserSubline: {
            de: "Jetzt Link kopieren und im passenden Browser öffnen",
            en: "Copy link and open it in a supported browser",
            cs: "Nyní prosím zkopírujte odkaz do jiného prohlížeče"
        },
        unsupportedBrowserHint: {
            de: "Safari oder Google Chrome benötigt",
            en: "Safari or Google Chrome required",
            cs: "Systém vyžaduje Safari nebo Google Chrome"
        },
        unsupportedBrowserCopy: {
            de: "Kopieren",
            en: "Copy",
            cs: "Kopírovat"
        },
        scrollCopyText: {
            de: "Link kopiert",
            en: "Link copied",
            cs: "Zkopírováno"
        },
        arBtnText1: {
            de: "IM RAUM",
            en: "VIEW IN",
            cs: "Ukázat"
        },
        arBtnText2: {
            de: "ANSEHEN",
            en: "YOUR SPACE",
            cs: "Váš prostor"
        },
        projectNotActiveInfo: {
            de: "Sorry, diese Produkt ist nicht mehr aktiv  ...",
            en: "Sorry, this product is not active anymore ...",
            cs: "Omlouváme se, ale tento produkt již není dostupný ..."
        },
        projectNotActiveHint: {
            de: "Bitte kontaktiere uns!",
            en: "Please contact us!",
            cs: "Prosím kontaktujte naší podporu"
        },
        projectNotActiveAction: {
            de: "office@mazingxr.com",
            en: "office@mazingxr.com",
            cs: "office@mazingxr.com",
            href: "mailto: office@mazingxr.com "
        },
        addRes: {}
    }
      , K = navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 0
      , Q = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || K;
    function ee(e) {
        return /\d/.test(e)
    }
    function te(e, ...t) {
        console.log("INFO: " + e, t)
    }
    function ne(e, ...t) {
        M && console.log("DEBUG: " + e, t)
    }
    function oe(e, ...t) {
        console.warn("WARN: " + e, t)
    }
    function ae(e, ...t) {
        console.error("ERROR: " + e, t)
    }
    async function ie() {
        te("Mazing-Viewer Version 2.4.1"),
        rt().includes("de") ? (te("Language German"),
        h = "de") : rt().includes("cs") ? (te("Language Czech"),
        h = "cs") : (te("Language English"),
        h = "en");
        const e = window.location.search
          , t = new URLSearchParams(e)
          , n = t.get("pr")
          , T = t.get("project")
          , O = t.get("customer")
          , g = t.get("otlc");
        g && (o = g);
        const C = t.get("session");
        if (C && (j = C,
        te("Override session: ", C)),
        t.get("TEST-MODE"),
        te("Fetching projectID: ", n),
        document.location.host.includes("localhost:") || ee(document.location.host)) {
            oe("Localhost analytics applied");
            const e = document.location.host.split(":")[0];
            k = `http://${e}:3020/pro/insert-impression/`,
            F = `http://${e}:3020/pro/insert-maintenance/`,
            D = `http://${e}:3020/pro/insert-experience/`,
            x = `http://${e}:3030/convert/`,
            G = `http://${e}:3020/pro/get-project/`,
            H = `http://${e}:3020/pro/cors-proxy/`,
            P = `http://${e}:3020/pro/web3-user-nonce/`,
            B = `http://${e}:3020/pro/web3-fetch-sign/`,
            U = `http://${e}:8080/base/?pr=`,
            V = `http://${e}:7200`,
            M = !0
        }
        document.location.host.includes("debug.mazing-ar.com");
        const A = document.getElementById("bodyId")
          , N = document.getElementById("headId")
          , f = document.createElement("div");
        f.id = "loading-modal",
        f.classList.add("loading-modal");
        const R = document.createElement("div");
        var L, w;
        if (R.classList.add("loader"),
        f.appendChild(R),
        A.appendChild(f),
        await (L = O,
        w = T,
        new Promise((async e=>{
            if ("meebits" === L) {
                te("Meebits handling activated", w);
                const e = "https://meebits.larvalabs.com/meebitimages/character3d?index=" + w
                  , n = await (t = e,
                new Promise(((e,n)=>{
                    ne("proxyToGlbBlob", t);
                    const o = new XMLHttpRequest;
                    o.onreadystatechange = function() {
                        4 == o.readyState && 200 == o.status && ne("proxyToGlbBlob SUCCESS", t)
                    }
                    ,
                    o.onload = async function() {
                        const t = await fetch(`data:model/gltf-binary;base64,${o.response}`)
                          , n = await t.blob()
                          , a = URL.createObjectURL(n);
                        te("base64Response", a),
                        e(a)
                    }
                    ,
                    o.onerror = ()=>{
                        n(err)
                    }
                    ,
                    o.open("POST", H, !0),
                    o.setRequestHeader("Content-type", "application/json"),
                    o.send(JSON.stringify({
                        url: t
                    }))
                }
                )));
                CONFIGURATION = {
                    project: w,
                    customer: L,
                    colorSelector: !1,
                    productSelector: !1,
                    logoColor: "blue",
                    btnColor: "blue",
                    autoRotate: !0,
                    autoRotateDelay: 2e3,
                    autoRotationPerSecond: "5deg",
                    disableImpressionTracking: !0,
                    environmentNeutral: !0,
                    whiteLabel: !1,
                    usdzAutoConversion: !0,
                    callToAction: "simple",
                    hideCallToActionAR: !0,
                    callToActionCustomIcon: "rocket.svg",
                    forceHighElements: !0
                },
                BASE_MODELS = [{
                    id: w,
                    glb: n,
                    orbit: "auto auto auto",
                    skipViewerModification: !0,
                    name: {
                        de: w,
                        en: w
                    },
                    callToAction: {
                        button: {
                            de: "UPGRADE MEEBIT",
                            en: "UPGRADE MEEBIT"
                        },
                        callback: "https://forms.gle/pCYPuWp7VvDmKjXz6",
                        title: {
                            de: "UPGRADE MEEBIT",
                            en: "UPGRADE MEEBIT"
                        },
                        subtitle: {
                            de: "UPGRADE MEEBIT",
                            en: "UPGRADE MEEBIT"
                        }
                    }
                }],
                PROJECT_NAME = w,
                CUSTOMER_NAME = L
            }
            var t;
            e()
        }
        ))),
        "undefined" == typeof CONFIGURATION) {
            let e;
            try {
                n ? (e = await de(G + "?projectUID=" + n + (g ? "&otlc=" + g : "")),
                r = n) : T && O && (e = await de(G + "?projectName=" + T + "&customerName=" + O + (g ? "&otlc=" + g : "")),
                r = O + "/" + T)
            } catch (e) {
                return void te("Error in returned project", e)
            }
            if (ne("prefetched return project", e),
            e.project.web3_contract_id && !e.project.s3) {
                te("Web3 Project fetched, authentication needed"),
                g && te("OTLC Link expired"),
                await function(e, t) {
                    return new Promise((n=>{
                        ot(!1);
                        const o = ct(Z.userRequestIntroLoginMetamask)
                          , a = ct(Z.userRequestBtnLoginMetamask)
                          , i = document.createElement("div");
                        i.id = "metamask-login-modal",
                        i.classList.add("metamask-login-container");
                        const s = document.createElement("div");
                        s.classList.add("metamask-login-modal");
                        const r = document.createElement("div");
                        r.classList.add("metamask-login-inner-container");
                        const c = document.createElement("p")
                          , l = ["metamask-login-product-text-p", "helvetica", "noselect"];
                        c.classList.add(...l),
                        c.innerText = t.customerName + " #" + t.projectName;
                        const d = document.createElement("img");
                        d.src = t.thumb,
                        d.classList.add("metamask-login-preview-image");
                        const m = document.createElement("p")
                          , u = ["metamask-login-wait-text-p", "helvetica", "noselect"];
                        m.classList.add(...u),
                        m.innerText = o;
                        const p = document.createElement("div");
                        p.classList.add("metamask-login-wait-text-container");
                        const E = document.createElement("button")
                          , h = ["metamask-login-btn", "helvetica"];
                        E.id = "metamask-login-btn-accept",
                        E.classList.add(...h);
                        const T = document.createElement("div");
                        T.classList.add("metamask-login-btn-wrapper");
                        const O = document.createElement("span");
                        O.innerText = a,
                        O.classList.add("metamask-login-btn-txt");
                        const I = document.createElement("img");
                        I.classList.add("metamask-login-btn-img"),
                        I.src = v.BASE_PATH + "img/icons/metamask.svg",
                        T.appendChild(I),
                        T.appendChild(O),
                        E.appendChild(T),
                        E.onclick = ()=>{
                            ot(!0),
                            i.style.display = "none",
                            n()
                        }
                        ;
                        let g = "Augmented Reality (" + ct(Z.supportedDevicesHint) + ")";
                        const C = document.createElement("p")
                          , A = ["helvetica", "metamask-login-hint-font", "noselect"];
                        C.classList.add(...A),
                        C.innerText = g;
                        const N = document.createElement("hr");
                        N.classList.add("default-hr"),
                        r.appendChild(m),
                        r.appendChild(E),
                        r.appendChild(N),
                        r.appendChild(C),
                        s.appendChild(c),
                        s.appendChild(d),
                        s.appendChild(r),
                        s.appendChild(p),
                        i.appendChild(s),
                        e.appendChild(i)
                    }
                    ))
                }(A, e.project),
                function(e) {
                    const t = document.createElement("div");
                    t.id = "metamask-waiting-container",
                    t.classList.add("metamask-waiting-container");
                    const n = document.createElement("p")
                      , o = ct(Z.metaMaskWaitText);
                    n.innerText = o;
                    const a = ["helvetica", "metamask-waiting-txt", "noselect"];
                    n.classList.add(...a);
                    const i = document.createElement("img");
                    i.classList.add("metamask-waiting-img"),
                    i.src = v.BASE_PATH + "img/icons/metamask.svg",
                    t.appendChild(i),
                    t.appendChild(n),
                    e.appendChild(t)
                }(A),
                me(!0);
                const t = await function(e) {
                    return new Promise((t=>{
                        const n = document.createElement("script");
                        n.onload = async()=>{
                            let e;
                            if (window.ethereum) {
                                const n = await window.ethereum.request({
                                    method: "eth_requestAccounts"
                                });
                                ne("Window Ether found"),
                                e = new Web3(window.ethereum),
                                t({
                                    result: !0,
                                    web3: e,
                                    wallet: n
                                }),
                                y = !0
                            } else
                                ne("Window Ether not found"),
                                t({
                                    result: !1
                                }),
                                y = !1
                        }
                        ,
                        n.src = v.BASE_PATH + "js/web3.min.js",
                        e.appendChild(n)
                    }
                    ))
                }(N);
                if (!t.result)
                    return void pe(A, "METAMASK_NOT_INSTALLED", e.project);
                {
                    const n = t.web3;
                    let a;
                    te("Web3 initialized", n);
                    try {
                        a = await de(P + "?address=" + t.wallet + "&projectUID=" + e.project.uid),
                        ne("Nonce Data received ", a)
                    } catch (t) {
                        return void pe(A, "OWNERSHIP_NOT_MATCHING", e.project)
                    }
                    const i = await function(e, t) {
                        return new Promise(((n,o)=>{
                            t.eth.personal.sign(t.utils.fromUtf8(`Nonce: ${e.user.nonce}`), e.user.wallet_address, ((e,t)=>{
                                n(e ? {
                                    result: !1
                                } : {
                                    result: !0,
                                    signature: t
                                })
                            }
                            ))
                        }
                        ))
                    }(a, n);
                    if (ne("Nonce Data signed ", i),
                    i && !0 === i.result) {
                        const n = await de(B + "?address=" + t.wallet + "&signature=" + i.signature + "&projectUID=" + e.project.uid);
                        ne("Encrypted project data ", n),
                        e = n,
                        o = n.otlc,
                        me(!1)
                    } else
                        window.location.reload()
                }
            }
            CUSTOMER_UID = e.project.Customer.uid,
            ne("CUSTOMER_UID", CUSTOMER_UID),
            PROJECT_UID = e.project.uid,
            ne("PROJECT_UID", PROJECT_UID),
            PROJECT_NAME = e.project.name,
            ne("returnedProject.project", e.project.s3),
            re(),
            ne("SESSION", SESSION),
            document.location.host.includes("localhost:") || ee(document.location.host) ? OBJECT_URL = "https://ds-demo.mazing.link/" + PROJECT_UID + "/" : OBJECT_URL = "https://ds-pro.mazing.link/" + PROJECT_UID + "/",
            ne("OBJECT_URL", OBJECT_URL);
            const t = await Promise.all([de(mt(OBJECT_URL + "config.maz")), de(mt(OBJECT_URL + "models.maz"))]);
            CONFIGURATION = t[0],
            ne("CONFIGURATION", CONFIGURATION);
            const a = e.project.Customer.addFeatures;
            if (ne("customer override", a),
            CONFIGURATION && a) {
                const e = JSON5.parse(a);
                e.whiteLabelLite && (CONFIGURATION.whiteLabelLite = e.whiteLabelLite),
                e.whiteLabel && (CONFIGURATION.whiteLabel = e.whiteLabel)
            }
            BASE_MODELS = t[1],
            ne("BASE_MODELS", BASE_MODELS);
            let i = !1;
            for (let e = 0; e < BASE_MODELS.length; e++)
                if (BASE_MODELS[e].gif || BASE_MODELS[e].video || BASE_MODELS[e].multimedia) {
                    i = !0;
                    break
                }
            if (i && function(e) {
                const t = document.createElement("script");
                t.onload = async()=>{
                    ue()
                }
                ,
                t.src = v.BASE_PATH + "js/three.min.js",
                e.appendChild(t)
            }(N),
            CONFIGURATION.modelPath = OBJECT_URL + "models/",
            CONFIGURATION.texturePath = OBJECT_URL + "models/textures/",
            CONFIGURATION.materialPath = OBJECT_URL + "models/materials/",
            CONFIGURATION.soundPath = OBJECT_URL + "sounds/",
            CONFIGURATION.videoPath = OBJECT_URL + "videos/",
            CONFIGURATION.gifPath = OBJECT_URL + "gifs/",
            CONFIGURATION.environmentPath = OBJECT_URL + "environment/",
            CONFIGURATION.encryption)
                for (let e = 0; e < BASE_MODELS.length; e++)
                    BASE_MODELS[e].glb = await le(CONFIGURATION.indexA, CONFIGURATION.indexB, CONFIGURATION.modelPath + BASE_MODELS[e].glb);
            PROJECT_ACTIVE = e.project.active && (-1 === e.project.Customer.view_limit || e.project.Customer.view_count < e.project.Customer.view_limit),
            PROJECT_ACTIVE || (CONFIGURATION.disableImpressionTracking = !0),
            CONFIGURATION.usdzAutoConversion && (v.USDZ_CONVERSION_INTEGRATED = !0),
            ne("PROJECT_ACTIVE", PROJECT_ACTIVE),
            await fetch(OBJECT_URL + "module.style.css").then((e=>e.text())).then((e=>{
                const t = document.createElement("style");
                t.innerHTML = e,
                N.appendChild(t)
            }
            )).catch((e=>console.error("Error setting custom css:", e)));
            const s = document.createElement("meta");
            s.name = "twitter:card",
            s.content = "player";
            const l = document.createElement("meta");
            l.name = "twitter:site",
            l.content = "MAZINGXR";
            const d = document.createElement("meta");
            d.name = "twitter:player:width",
            d.content = "480";
            const m = document.createElement("meta");
            m.name = "twitter:player:height",
            m.content = "480";
            const u = document.createElement("meta");
            u.name = "twitter:player",
            u.content = window.location.href;
            const p = document.createElement("meta");
            p.property = "og:title",
            p.content = "MazingXR";
            const E = document.createElement("meta");
            E.property = "og:description",
            E.content = CONFIGURATION.project + " - Mazing 3D Model";
            const h = document.createElement("meta");
            h.property = "og:image",
            h.content = BASE_MODELS[0].poster.includes("blob:") ? BASE_MODELS[0].poster : c + BASE_MODELS[0].poster,
            N.appendChild(s),
            N.appendChild(l),
            N.appendChild(d),
            N.appendChild(m),
            N.appendChild(u),
            N.appendChild(p),
            N.appendChild(E),
            N.appendChild(h)
        } else
            PROJECT_ACTIVE = !0,
            PROJECT_UID = n;
        CONFIGURATION.basePath ? v.BASE_PATH = CONFIGURATION.basePath : document.location.host.includes("mazing.link") && (v.BASE_PATH = "https://mazing.link/");
        const S = t.get("autoStart");
        it() || window.addEventListener("scene-viewer-failed-event", (()=>{
            ae("Received Scene Viewer failed event")
        }
        )),
        window.addEventListener("hint-wheel-event", (()=>{
            const e = Qe();
            if (e && e.model) {
                const e = document.getElementById("scroll-hint");
                e.className.includes("show") || (e.className = e.className + " show",
                setTimeout((function() {
                    e.className = e.className.replace("show", "")
                }
                ), 3e3))
            }
        }
        ));
        try {
            ne("top location origin (origin)", document.referrer)
        } catch (e) {
            ne("top location origin (error)", e.message)
        }
        if (6 === CONFIGURATION.mode && (Z.arBtnText1 = {
            de: "VIRTUELL",
            en: "TRY ON"
        },
        Z.arBtnText2 = {
            de: "ANPROBIEREN",
            en: "VIRTUAL"
        }),
        CONFIGURATION.overrideLangRes)
            for (let e = 0; e < CONFIGURATION.overrideLangRes.length; e++) {
                const t = CONFIGURATION.overrideLangRes[e];
                Z[t.key] = t.overrides
            }
        const _ = t.get("mazingWorld");
        (CONFIGURATION.disableImpressionTracking || _ || t.get("disableImpressionTracking")) && (v.DISABLE_IMPRESSION_TRACKING = !0),
        CONFIGURATION.disableBrowserCheck && (te("Browser Check Deactivated"),
        v.BROWSER_CHECK_ACTIVE = !1),
        CONFIGURATION.colorAnimation && (ne("Color Animation Active"),
        v.COLOR_ANIMATION = CONFIGURATION.colorAnimation),
        CONFIGURATION.modelPath && (c = CONFIGURATION.modelPath,
        ne("Different modelPath", c)),
        CONFIGURATION.texturePath && (l = CONFIGURATION.texturePath,
        ne("Different texturePath", l)),
        CONFIGURATION.materialPath && (d = CONFIGURATION.materialPath,
        ne("Different materialPath", d)),
        CONFIGURATION.soundPath && (m = CONFIGURATION.soundPath,
        ne("Different soundPath", m)),
        CONFIGURATION.videoPath && (u = CONFIGURATION.videoPath,
        ne("Different videoPath", u)),
        CONFIGURATION.gifPath && (p = CONFIGURATION.gifPath,
        ne("Different gifPath", p)),
        CONFIGURATION.environmentPath && (E = CONFIGURATION.environmentPath,
        ne("Different environmentPath", E)),
        CONFIGURATION.callToAction ? (t.get("callToActionDisabled") ? v.CALL_TO_ACTION_TYPE = "none" : v.CALL_TO_ACTION_TYPE = CONFIGURATION.callToAction,
        CONFIGURATION.hideCallToAction3D || t.get("hideCallToAction3D") ? v.HIDE_CALL_TO_ACTION_3D = !0 : v.HIDE_CALL_TO_ACTION_3D = !1,
        CONFIGURATION.hideCallToActionAR || t.get("hideCallToActionAR") ? v.HIDE_CALL_TO_ACTION_AR = !0 : v.HIDE_CALL_TO_ACTION_AR = !1) : v.CALL_TO_ACTION_TYPE = "none",
        "simple" !== v.CALL_TO_ACTION_TYPE || v.HIDE_CALL_TO_ACTION_3D || f.classList.add("loading-modal-cta"),
        CONFIGURATION.textureNamingMode && (v.TEXTURE_NAMING = CONFIGURATION.textureNamingMode),
        6 === CONFIGURATION.mode && (v.GLASS_TRY_ON = !0);
        let z = BASE_MODELS[0];
        CONFIGURATION.integrationActive && (te("Integration Listener activated"),
        v.INTEGRATION_ACTIVE = CONFIGURATION.integrationActive,
        window.onmessage = e=>{
            if (e.data)
                switch (e.data.type) {
                case "SWITCH_COLOR_INTEGRATOR":
                    ne("SWITCH_COLOR Triggered");
                    break;
                case "ADD_TO_CART_INTEGRATOR":
                    te("ADD_TO_CART_INTEGRATOR Triggered"),
                    qe(tt().id, "add_to_cart");
                    break;
                case "EXTERNAL_AR_TRIGGER":
                    te("EXTERNAL_AR_TRIGGER Triggered"),
                    Ue();
                    break;
                case "SWITCH_TEXTURE_INTEGRATOR":
                    ne("SWITCH_TEXTURE Triggered"),
                    function(e) {
                        const t = tt();
                        ne("Parent Called switchToTextureIdx", e),
                        nt(!0, t, e, !0)
                    }(e.data.value.textureIdx);
                    break;
                case "SWITCH_MODEL_INTEGRATOR":
                    ne("SWITCH_MODEL Triggered"),
                    function(e) {
                        ne("Parent Called switchToModelIdx", e);
                        const t = document.getElementById("productSelector");
                        t && (t.selectedIndex = e),
                        s = !0,
                        he(!0)
                    }(e.data.value.modelIdx);
                    break;
                case "FORCE_LOAD_MODEL":
                    ne("Model forced load"),
                    ce();
                    break;
                default:
                    te("integration received unknown event", e)
                }
        }
        ),
        CONFIGURATION.variantMode && (window.onmessage = e=>{
            if (e.data)
                switch (e.data.type) {
                case "SWITCH_VARIANT":
                    ne("SWITCH_VARIANT Triggered"),
                    ne("Parent Called switchVariantToName", t = e.data.value.variantName),
                    Qe().variantName = t
                }
            var t
        }
        ),
        CONFIGURATION.fixedViewerSet && (v.VIEWER_SET = CONFIGURATION.fixedViewerSet),
        CONFIGURATION.arScaleMode && (v.AR_SCALE_MODE = CONFIGURATION.arScaleMode,
        "fixed" === CONFIGURATION.arScaleMode && (I = "allowsContentScaling=0"));
        const X = document.createElement("mazing-viewer");
        X.alt = "A Mazing 3D Model",
        X.setAttribute("touch-action", "pan-y pan-x"),
        X.setAttribute("quick-look-browsers", "safari chrome"),
        X.setAttribute("ar-modes", v.VIEWER_SET),
        X.setAttribute("ar-scale", v.AR_SCALE_MODE),
        X.setAttribute("disable-pan", ""),
        X.setAttribute("minimumRenderScale", "1"),
        X.setAttribute("camera-controls", ""),
        X.setAttribute("ar", ""),
        X.setAttribute("bounds", "tight"),
        X.setAttribute("camera-orbit", z.orbit),
        X.setAttribute("interpolation-decay", "70"),
        CONFIGURATION.threedScaleMode && "fixed" === CONFIGURATION.threedScaleMode && X.setAttribute("disable-zoom", ""),
        CONFIGURATION.lazyLoad && (X.setAttribute("interaction-prompt-threshold", "0"),
        X.setAttribute("reveal", "manual")),
        X.setAttribute("fallback-url", U + "back.html?maintenance=" + Xe("ar-start-failed", !1)),
        z.orbitRange ? (X.setAttribute("min-camera-orbit", z.orbitRange.min),
        X.setAttribute("max-camera-orbit", z.orbitRange.max)) : (X.removeAttribute("min-camera-orbit"),
        X.removeAttribute("max-camera-orbit")),
        se(X),
        CONFIGURATION.wallPlacement && X.setAttribute("ar-placement", "wall"),
        CONFIGURATION.autoRotate && (X.setAttribute("auto-rotate", ""),
        CONFIGURATION.autoRotationPerSecond && X.setAttribute("rotation-per-second", CONFIGURATION.autoRotationPerSecond),
        CONFIGURATION.autoRotateDelay && X.setAttribute("auto-rotate-delay", CONFIGURATION.autoRotateDelay)),
        CONFIGURATION.skybox && X.setAttribute("skybox-image", v.BASE_PATH + "img/environment/" + CONFIGURATION.skybox),
        CONFIGURATION.preventInteractionPrompt && X.setAttribute("interaction-prompt", "none");
        const J = CONFIGURATION.forceHighElements ? "mazing-viewer-high-elements" : "mazing-viewer-standard";
        X.classList.add(J);
        const $ = document.createElement("div");
        $.id = "hidden-ar-btn",
        $.slot = "ar-button",
        X.appendChild($);
        const K = document.createElement("img");
        K.id = "own-swipe-btn",
        K.classList.add("swipe-btn"),
        K.slot = "interaction-prompt",
        K.src = v.BASE_PATH + "img/swipe.png",
        X.appendChild(K);
        let ie = ct(Z.webXrMovement);
        const Ee = document.createElement("div");
        Ee.id = "web-ar-prompt-container";
        const Oe = document.createElement("div");
        Oe.id = "web-ar-prompt";
        const Ie = document.createElement("img");
        Ie.classList.add("web-ar-hand"),
        Ie.src = v.BASE_PATH + "img/ar-hand.png",
        Oe.appendChild(Ie),
        Ee.appendChild(Oe);
        const ge = document.createElement("div");
        ge.classList.add("web-ar-movement-hint-container");
        const Ae = document.createElement("p");
        if (Ae.innerText = ie,
        Ae.classList.add("helvetica", "web-ar-movement-hint-text"),
        ge.appendChild(Ae),
        Ee.appendChild(ge),
        X.appendChild(Ee),
        "simple" === v.CALL_TO_ACTION_TYPE && !v.HIDE_CALL_TO_ACTION_AR) {
            const e = document.createElement("div");
            e.id = "web-ar-footer-container";
            const t = document.createElement("div");
            t.id = "web-ar-footer";
            const n = document.createElement("div");
            n.classList.add("web-ar-product-detail");
            const o = document.createElement("p");
            o.id = "web-ar-product-title",
            o.classList.add("helvetica");
            const a = document.createElement("p");
            a.id = "web-ar-product-subtitle",
            a.classList.add("helvetica"),
            n.appendChild(o),
            n.appendChild(a),
            t.appendChild(n);
            const i = document.createElement("a");
            i.id = "web-ar-product-link",
            i.target = "_blank",
            i.href = "",
            i.onclick = ()=>{
                Ke(!0)
            }
            ;
            const s = document.createElement("p");
            s.id = "web-ar-product-button",
            s.classList.add("helvetica"),
            i.appendChild(s),
            t.appendChild(i),
            e.appendChild(t),
            X.appendChild(e)
        }
        if (CONFIGURATION.thirdPartyViewerOverlay) {
            const e = document.createElement("iframe");
            e.id = "third-party-iframe",
            e.classList.add("third-party-iframe"),
            A.appendChild(e)
        }
        if (A.appendChild(X),
        function(e, t) {
            let n = CONFIGURATION.textureSelector || CONFIGURATION.colorSelector || CONFIGURATION.productSelector ? "right" : "center";
            CONFIGURATION.buttonType && (n = CONFIGURATION.buttonType);
            const o = document.createElement("button");
            o.id = "control-ar-btn";
            const a = ["ar-button", "ar-icon", "noselect", "ar-icon-button-style-" + n];
            CONFIGURATION.productSelector && (CONFIGURATION.colorSelector || CONFIGURATION.textureSelector) && a.push("ar-icon-multi"),
            CONFIGURATION.fullPageSelector && a.push("ar-full-page-selector"),
            (CONFIGURATION.hideARBtn && _e() || CONFIGURATION.forceHideARBtn) && a.push("hide-ar-btn"),
            a.push("pulse-button"),
            v.BTN_COLOR = CONFIGURATION.btnColor,
            _e() || (te("fallback to btn color blue because no iframe launched"),
            v.BTN_COLOR = "blue");
            const i = e.get("wishedBtnColor");
            i && CONFIGURATION.allowParameterBtnColor && (v.BTN_COLOR = "blue" === i ? "blue" : "white"),
            CONFIGURATION.btnColorClass && a.push(CONFIGURATION.btnColorClass),
            CONFIGURATION.variantMode && a.push("displayNone");
            const s = ct(Z.arBtnText1)
              , r = ct(Z.arBtnText2)
              , c = document.createElement("img");
            c.src = v.BASE_PATH + "img/ar-action-logo.svg",
            c.alt = "Ar Action Logo";
            const l = ["svg-color-" + v.BTN_COLOR, "ar-btn-icon", "ar-btn-icon-style-" + n];
            c.classList.add(...l),
            o.appendChild(c);
            const d = document.createElement("div");
            d.classList.add("ar-btn-text-container");
            const m = document.createElement("p");
            if (m.id = "ar-btn-text-1",
            m.classList.add("helvetica", "no-bottom-margin", "font-color-" + v.BTN_COLOR, "ar-btn-text-1", "ar-btn-text-style-" + n),
            m.innerText = "right" === n || "left" === n ? s : s + " " + r,
            d.appendChild(m),
            "right" === n || "left" === n) {
                const e = document.createElement("p");
                e.id = "ar-btn-text-2",
                e.classList.add("helvetica", "no-bottom-margin", "font-color-" + v.BTN_COLOR, "ar-btn-text-2"),
                e.innerText = r,
                d.appendChild(e)
            }
            o.appendChild(d),
            o.classList.add(...a),
            o.onclick = ()=>{
                Ue()
            }
            ,
            t.appendChild(o),
            fitty("#ar-btn-text-1", {
                multiLine: !1,
                minSize: 2,
                maxSize: 300
            }),
            "right" !== n && "left" !== n || fitty("#ar-btn-text-2", {
                multiLine: !1,
                minSize: 2,
                maxSize: 300
            })
        }(t, A),
        CONFIGURATION.productSelectorType && (v.PRODUCT_SELECTOR_TYPE = CONFIGURATION.productSelectorType),
        CONFIGURATION.textureSelectorType && (v.TEXTURE_SELECTOR_TYPE = CONFIGURATION.textureSelectorType),
        CONFIGURATION.productSelector || "seiseralm" === CONFIGURATION.api)
            if ("images" === v.PRODUCT_SELECTOR_TYPE) {
                let e = BASE_MODELS[0].name ? ct(BASE_MODELS[0].name) : BASE_MODELS[0].id;
                const t = document.createElement("div");
                t.id = "product-selector-images-container";
                const n = ["product-selector-images-container"];
                CONFIGURATION.textureSelector && n.push("product-selector-images-container-and-texture"),
                n.push("inline-block"),
                t.classList.add(...n);
                const o = document.createElement("p");
                o.id = "productTypeText";
                const a = ["helvetica", "inline-block", "margin-left-font", "product-type-text", "font-color-" + v.BTN_COLOR];
                o.innerText = e,
                o.classList.add(...a),
                t.appendChild(o);
                const i = document.createElement("div");
                i.id = "productSelector";
                const s = ["product-selector", "inline-block"];
                i.classList.add(...s),
                CONFIGURATION.productSelectorOverflow && i.classList.add("product-container-overflow"),
                t.appendChild(document.createElement("div")),
                t.appendChild(i),
                A.appendChild(t)
            } else {
                let e = "solo";
                (CONFIGURATION.textureSelector || CONFIGURATION.colorSelector) && (e = "");
                let t = ct(Z.selectProduct);
                const n = document.createElement("div");
                n.id = "product-selector-container";
                const o = ["product-selector-container", "inline-block"];
                e && o.push(e),
                n.classList.add(...o);
                const a = document.createElement("p")
                  , i = ["helvetica", "inline-block", "margin-left-font", "noselect"];
                a.innerText = t,
                a.classList.add(...i),
                n.appendChild(a),
                n.appendChild(document.createElement("div"));
                const s = document.createElement("select");
                s.id = "productSelector";
                const r = ["product-selector", "inline-block", "noselect"];
                s.classList.add(...r),
                s.onchange = ()=>{
                    he(!0)
                }
                ,
                n.appendChild(s),
                A.appendChild(n)
            }
        if (CONFIGURATION.textureSelector) {
            const e = document.createElement("div");
            e.id = "texture-selector-container";
            const t = ["texture-selector-container", "inline-block"];
            if (e.classList.add(...t),
            "dropdown" === CONFIGURATION.textureSelectorAppearance) {
                let t = ct(Z.selectTextureDropdown);
                const n = document.createElement("p")
                  , o = ["helvetica", "inline-block", "margin-left-font", "noselect"];
                n.innerText = t,
                n.classList.add(...o),
                e.appendChild(n),
                e.appendChild(document.createElement("div"));
                const a = document.createElement("select");
                a.id = "texture-container";
                const i = ["product-selector", "inline-block", "noselect"];
                a.classList.add(...i),
                e.appendChild(a)
            } else {
                const t = document.createElement("p")
                  , n = ["helvetica", "inline-block", "margin-left-font", "noselect"];
                t.id = "texture-name",
                t.classList.add(...n),
                e.appendChild(t),
                e.appendChild(document.createElement("div"));
                const o = document.createElement("div");
                o.id = "texture-container";
                const a = ["texture-container", "inline-block"];
                o.classList.add(...a),
                CONFIGURATION.textureSelectorOverflow && o.classList.add("texture-container-overflow"),
                e.appendChild(o)
            }
            A.appendChild(e)
        }
        if (CONFIGURATION.colorSelector) {
            let e = ct(Z.selectColor);
            const t = document.createElement("div");
            t.id = "color-selector-container";
            const n = ["color-selector-container", "inline-block"];
            t.classList.add(...n);
            const o = document.createElement("p")
              , a = ["helvetica", "inline-block", "margin-left-font"];
            o.innerText = e,
            o.classList.add(...a),
            t.appendChild(o),
            t.appendChild(document.createElement("div"));
            const i = document.createElement("div");
            i.id = "color-container";
            const s = ["color-container", "inline-block"];
            i.classList.add(...s),
            t.appendChild(i),
            A.appendChild(t)
        }
        if (t.get("wishedWhiteLabel") && CONFIGURATION.allowParameterWhiteLabel && (CONFIGURATION.whiteLabel = !0),
        !CONFIGURATION.whiteLabel && !CONFIGURATION.whiteLabelLite) {
            const e = document.createElement("div")
              , t = ["logo-div"];
            "simple" !== v.CALL_TO_ACTION_TYPE || v.HIDE_CALL_TO_ACTION_3D || t.push("logo-align-left"),
            e.classList.add(...t);
            const n = document.createElement("a");
            n.href = "https://www.mazingxr.com/",
            n.target = "_blank";
            const o = document.createElement("img");
            o.classList.add("inside-logo"),
            o.classList.add("noselect"),
            o.alt = "Logo Mazing",
            "blue" === CONFIGURATION.logoColor ? o.src = v.BASE_PATH + "img/Logo_Neu_Blau.png" : "gray" === CONFIGURATION.logoColor && (o.src = v.BASE_PATH + "img/Logo_Neu_Grau.png"),
            n.appendChild(o),
            e.appendChild(n),
            A.appendChild(e)
        }
        if ("simple" === v.CALL_TO_ACTION_TYPE && !v.HIDE_CALL_TO_ACTION_3D) {
            const e = document.createElement("a");
            e.id = "call-to-action-link",
            e.href = "",
            e.target = "_blank",
            e.onclick = ()=>{
                Ke(!1)
            }
            ;
            const t = document.createElement("div");
            t.id = "cta-btn";
            const n = ["cta-btn", "helvetica"];
            t.classList.add(...n);
            const o = document.createElement("img")
              , a = ["call-to-action-icon"];
            if (o.classList.add(...a),
            !CONFIGURATION.callToActionSkipIcon) {
                let e = "cart-white.svg";
                CONFIGURATION.callToActionCustomIcon && (e = CONFIGURATION.callToActionCustomIcon),
                o.src = v.BASE_PATH + "img/icons/" + e,
                o.alt = "White Cart",
                t.appendChild(o)
            }
            const i = document.createElement("span");
            if (i.id = "call-to-action-headline",
            t.appendChild(i),
            e.appendChild(t),
            CONFIGURATION.callToActionShowSubtitle) {
                const e = document.createElement("span");
                e.id = "call-to-action-button-subtitle",
                t.appendChild(e)
            }
            A.appendChild(e)
        }
        let Ne = ct(Z.qrInfo);
        const be = document.createElement("div");
        be.id = "qr-modal",
        be.classList.add("qr-modal");
        const fe = document.createElement("div");
        fe.classList.add("qr-modal-content");
        const Re = document.createElement("span");
        Re.classList.add("close"),
        Re.id = "qr-modal-close",
        Re.innerHTML = "&times;";
        const ye = document.createElement("p");
        ye.classList.add("helvetica", "qr-code-modal-font", "noselect"),
        ye.innerText = Ne;
        const Le = document.createElement("div");
        Le.id = "qrcode",
        Le.classList.add("qrcode");
        let we = ct(Z.supportedDevicesHint);
        const Se = document.createElement("p");
        Se.classList.add("helvetica", "qr-code-hint-font", "noselect"),
        Se.innerText = we;
        const xe = document.createElement("hr");
        xe.classList.add("qr-code-hr");
        const Me = document.createElement("hr");
        Me.classList.add("qr-code-hr");
        const ke = document.createElement("div");
        ke.classList.add("qr-powered-by-logo-container");
        const Fe = document.createElement("img");
        if (Fe.id = "qr-powered-by-logo",
        Fe.src = v.BASE_PATH + "img/powered-by.svg",
        Fe.classList.add("qr-powered-by-logo"),
        fe.appendChild(Re),
        fe.appendChild(ye),
        fe.appendChild(xe),
        fe.appendChild(Le),
        !CONFIGURATION.whiteLabel) {
            const e = document.createElement("a");
            e.href = "https://www.mazingxr.com/",
            e.target = "_blank",
            Le.classList.add("qr-powered-by-margin"),
            ke.appendChild(Fe),
            e.appendChild(ke),
            fe.appendChild(e)
        }
        fe.appendChild(Me),
        fe.appendChild(Se),
        be.appendChild(fe),
        A.appendChild(be);
        let De = ct(Z.unsupportedBrowserHeadline)
          , Pe = ct(Z.unsupportedBrowserSubline)
          , Be = ct(Z.unsupportedBrowserHint)
          , Ve = ct(Z.unsupportedBrowserCopy);
        const je = document.createElement("div");
        je.id = "unsupported-browser-modal",
        je.classList.add("unsupported-browser-modal");
        const ze = document.createElement("div");
        ze.classList.add("unsupported-browser-modal-content");
        const Je = document.createElement("span");
        Je.classList.add("close"),
        Je.id = "unsupported-browser-modal-close",
        Je.innerHTML = "&times;";
        const Ye = document.createElement("p");
        Ye.id = "unsupported-browser-headline",
        Ye.classList.add("helvetica", "unsupported-browser-modal-font", "noselect"),
        Ye.innerText = De;
        const Ze = document.createElement("div");
        Ze.classList.add("copy-container");
        const at = document.createElement("input");
        at.id = "unsupported-browser-input",
        at.classList.add("helvetica", "copy-link");
        let st = U + PROJECT_UID;
        o && (st = ve() ? U + PROJECT_NAME + "/?otlc=" + o : st + "&otlc=" + o),
        at.value = st;
        const lt = document.createElement("button");
        lt.classList.add("helvetica", "copy-btn", "noselect"),
        lt.innerText = Ve,
        lt.onclick = ()=>{
            const e = document.getElementById("unsupported-browser-input");
            e.focus(),
            e.select(),
            document.execCommand("copy");
            const t = document.getElementById("copy-paste-container");
            t.className.includes("show") || (t.className = t.className + " show",
            setTimeout((function() {
                t.className = t.className.replace("show", "")
            }
            ), 3e3))
        }
        ,
        Ze.appendChild(at),
        Ze.appendChild(lt);
        const ut = document.createElement("p");
        ut.classList.add("helvetica", "unsupported-browser-modal-font", "noselect"),
        ut.innerText = Pe;
        const pt = document.createElement("p");
        pt.classList.add("helvetica", "unsupported-browser-modal-hint-font", "noselect"),
        pt.innerText = Be;
        const Et = document.createElement("hr");
        Et.classList.add("unsupported-browser-modal-hr"),
        ze.appendChild(Je),
        ze.appendChild(Ye),
        ze.appendChild(Ze),
        ze.appendChild(ut),
        ze.appendChild(Et),
        ze.appendChild(pt),
        je.appendChild(ze),
        A.appendChild(je);
        let ht = ct(Z.arFailed)
          , Tt = ct(Z.supportedDevicesHint);
        const Ot = document.createElement("div");
        Ot.id = "failed-modal",
        Ot.classList.add("failed-modal");
        const It = document.createElement("div");
        It.classList.add("failed-modal-content");
        const gt = document.createElement("span");
        gt.classList.add("close"),
        gt.id = "failed-modal-close",
        gt.innerHTML = "&times;";
        const Ct = document.createElement("p");
        Ct.classList.add("helvetica", "failed-modal-font", "noselect"),
        Ct.innerText = ht;
        const At = document.createElement("p");
        At.classList.add("helvetica", "qr-code-hint-font", "noselect"),
        At.innerText = Tt;
        const Nt = document.createElement("hr");
        Nt.classList.add("failed-hr"),
        It.appendChild(gt),
        It.appendChild(Ct),
        It.appendChild(Nt),
        It.appendChild(At),
        Ot.appendChild(It),
        A.appendChild(Ot);
        let bt = ct(Z.arViewWorld);
        const ft = document.createElement("div");
        ft.id = "ar-world-modal",
        ft.classList.add("ar-world-modal");
        const Rt = document.createElement("div");
        Rt.classList.add("ar-world-modal-content");
        const yt = document.createElement("span");
        yt.classList.add("close"),
        yt.id = "ar-world-modal-close",
        yt.innerHTML = "&times;";
        const Lt = document.createElement("p");
        if (Lt.classList.add("helvetica", "ar-world-modal-font", "noselect"),
        Lt.innerText = bt,
        Rt.appendChild(yt),
        Rt.appendChild(Lt),
        ft.appendChild(Rt),
        A.appendChild(ft),
        PROJECT_ACTIVE)
            qe(BASE_MODELS[0].id, "view");
        else {
            let e = ct(Z.projectNotActiveInfo)
              , t = ct(Z.projectNotActiveHint)
              , n = ct(Z.projectNotActiveAction)
              , o = Z.projectNotActiveAction.href;
            const a = document.createElement("div");
            a.id = "project-deactivation-notice",
            a.classList.add("project-deactivation-notice");
            const i = document.createElement("p")
              , s = ["helvetica", "project-deactivation-font", "project-deactivation-font-info", "noselect"];
            i.classList.add(...s),
            i.innerText = e;
            const r = document.createElement("hr");
            r.classList.add("project-deactivation-hr");
            const c = document.createElement("p")
              , l = ["helvetica", "project-deactivation-font"];
            c.classList.add(...l),
            c.innerText = t;
            const d = document.createElement("div");
            d.classList.add("project-deactivation-action-container");
            const m = document.createElement("a");
            m.href = o,
            m.target = "_blank";
            const u = document.createElement("button")
              , p = ["helvetica", "project-deactivation-font", "project-deactivation-btn", "noselect"];
            u.classList.add(...p),
            u.innerText = n,
            m.appendChild(u),
            d.appendChild(m);
            const E = document.createElement("div");
            E.classList.add("project-deactivation-logo-container");
            const h = document.createElement("a");
            h.href = "https://mazingxr.com",
            h.target = "_blank",
            h.classList.add("project-deactivation-link-align");
            const T = document.createElement("img");
            T.classList.add("project-deactivation-logo"),
            T.classList.add("noselect"),
            T.alt = "Logo Mazing",
            T.src = v.BASE_PATH + "img/Logo_Neu_Blau.png",
            h.appendChild(T),
            E.appendChild(h),
            a.appendChild(i),
            a.appendChild(c),
            a.appendChild(r),
            a.appendChild(d),
            a.appendChild(E),
            A.appendChild(a)
        }
        if (v.GLASS_TRY_ON) {
            const e = document.createElement("div");
            e.style.display = "none",
            e.classList.add("try-on-container"),
            e.id = "try-on-container";
            const t = document.createElement("span");
            t.classList.add("close"),
            t.classList.add("close-glass-try-on"),
            t.id = "try-on-modal-close",
            t.innerHTML = "";
            const n = document.createElement("img");
            n.src = v.BASE_PATH + "img/icons/keyboard-backspace.svg",
            n.classList.add("back-icon-glass-try-on"),
            t.appendChild(n),
            e.appendChild(t);
            const o = document.createElement("iframe");
            o.id = "glass-iframe",
            o.setAttribute("allowusermedia", !0),
            o.setAttribute("scroll", "no"),
            o.setAttribute("allowfullscreen", !0),
            o.setAttribute("frameborder", "0"),
            o.setAttribute("allow", "accelerometer; magnetometer; autoplay; encrypted-media; gyroscope; picture-in-picture; camera *; xr-spatial-tracking;"),
            e.appendChild(o),
            t.onclick = ()=>{
                o.contentWindow.postMessage({
                    type: "STOP_WEBCAM",
                    value: {}
                }, "*")
            }
            ,
            A.appendChild(e)
        }
        const vt = ct(Z.loadingAR)
          , wt = document.createElement("div");
        wt.id = "ar-loading-modal",
        wt.classList.add("ar-loading-container");
        const St = document.createElement("div");
        St.classList.add("ar-loading-modal");
        const _t = document.createElement("span");
        _t.classList.add("close"),
        _t.classList.add("close-ar-loading"),
        _t.id = "ar-loading-modal-close",
        _t.innerHTML = "&times;",
        St.appendChild(_t);
        const xt = document.createElement("div");
        xt.classList.add("ar-loader"),
        St.appendChild(xt);
        const Ut = document.createElement("div");
        Ut.classList.add("ar-wait-text-container");
        const Mt = document.createElement("p");
        if (Mt.classList.add("ar-wait-text-p", "helvetica"),
        Mt.innerText = vt,
        Ut.appendChild(Mt),
        St.appendChild(Ut),
        wt.appendChild(St),
        A.appendChild(wt),
        S) {
            te("Url Parameter autoStart Found"),
            Y = !0;
            const e = ct(Z.loadingAutoStart)
              , t = document.createElement("div");
            t.id = "autostart-loading-modal",
            t.classList.add("autostart-loading-container");
            const n = document.createElement("div");
            n.classList.add("autostart-loading-modal");
            const o = document.createElement("div");
            o.classList.add("autostart-loader"),
            n.appendChild(o);
            const a = document.createElement("div");
            a.classList.add("autostart-wait-text-container");
            const i = document.createElement("p")
              , s = ["autostart-wait-text-p", "helvetica"];
            i.classList.add(...s),
            i.innerText = e,
            a.appendChild(i),
            n.appendChild(a),
            t.appendChild(n),
            A.appendChild(t);
            const r = document.getElementById("control-ar-btn");
            if (r && (r.style.visibility = "hidden"),
            Q && !it()) {
                const e = ct(Z.userRequestTextAutoStart)
                  , t = ct(Z.userRequestBtnAutoStart)
                  , n = document.createElement("div");
                n.id = "permission-modal",
                n.classList.add("permission-container");
                const o = document.createElement("div");
                o.classList.add("permission-modal");
                const a = document.createElement("div");
                a.classList.add("permission-inner-container");
                const i = document.createElement("p")
                  , s = ["permission-wait-text-p", "helvetica", "noselect"];
                i.classList.add(...s),
                i.innerText = e;
                const r = document.createElement("div");
                r.classList.add("permission-wait-text-container");
                const c = document.createElement("button")
                  , l = ["permission-btn", "helvetica"];
                c.id = "permission-btn-accept",
                c.classList.add(...l),
                c.innerText = t;
                const d = document.createElement("span");
                d.classList.add("close"),
                d.classList.add("close-permission"),
                d.id = "permission-modal-close",
                d.innerHTML = "&times;";
                let m = ct(Z.supportedDevicesHint);
                const u = document.createElement("p")
                  , p = ["helvetica", "permission-hint-font", "noselect"];
                u.classList.add(...p),
                u.innerText = m;
                const E = document.createElement("hr");
                E.classList.add("qr-code-hr"),
                a.appendChild(i),
                a.appendChild(c),
                a.appendChild(E),
                a.appendChild(u),
                o.appendChild(d),
                o.appendChild(a),
                o.appendChild(r),
                n.appendChild(o),
                A.appendChild(n)
            }
            Q || v.GLASS_TRY_ON || Ge()
        }
        if ((CONFIGURATION.colorSelector || CONFIGURATION.textureSelector || v.USDZ_CONVERSION_INTEGRATED) && it()) {
            const e = ct(Z.loadingUSDZ)
              , t = document.createElement("div");
            t.id = "usdz-loading-modal",
            t.classList.add("usdz-loading-container");
            const n = document.createElement("div");
            n.classList.add("usdz-loading-modal");
            const o = document.createElement("div");
            o.classList.add("autostart-loader"),
            n.appendChild(o);
            const a = document.createElement("div");
            a.classList.add("usdz-wait-text-container");
            const i = document.createElement("p")
              , s = ["usdz-wait-text-p", "helvetica"];
            i.classList.add(...s),
            i.innerText = e,
            a.appendChild(i),
            n.appendChild(a),
            t.appendChild(n),
            A.appendChild(t)
        }
        const Gt = ct(Z.scrollCopyText)
          , kt = document.createElement("div");
        kt.id = "copy-paste-container",
        kt.classList.add("copy-paste-container");
        const Ft = document.createElement("p");
        Ft.classList.add("copy-paste-container-p", "helvetica"),
        Ft.innerText = Gt,
        kt.appendChild(Ft),
        A.appendChild(kt);
        const Dt = it() ? ct(Z.scrollHintIos) : ct(Z.scrollHintPc)
          , Pt = document.createElement("div");
        Pt.id = "scroll-hint",
        Pt.classList.add("scroll-hint-text-container");
        const Bt = document.createElement("p");
        if (Bt.id = "scroll-hint-text",
        Bt.classList.add("scroll-hint-text-p", "helvetica"),
        Bt.innerText = Dt,
        Pt.appendChild(Bt),
        A.appendChild(Pt),
        CONFIGURATION.productSelector) {
            const e = document.getElementById("productSelector");
            if ("images" === v.PRODUCT_SELECTOR_TYPE) {
                const n = document.getElementById("productTypeText");
                for (let t = 0; t < BASE_MODELS.length; t++) {
                    const o = document.createElement("img");
                    BASE_MODELS[t].icon && (o.src = BASE_MODELS[t].icon.includes("blob:") ? BASE_MODELS[t].icon : d + BASE_MODELS[t].icon,
                    o.id = BASE_MODELS[t].id,
                    o.addEventListener("click", (function() {
                        e.value = BASE_MODELS[t].id,
                        he(!0),
                        n.innerText = BASE_MODELS[t].name ? ct(BASE_MODELS[t].name) : BASE_MODELS[t].id
                    }
                    )),
                    o.classList.add("material-selection"),
                    o.classList.add("no-highlight-click"),
                    e.appendChild(o),
                    q.push(o))
                }
                if (e) {
                    const n = t.get("model");
                    n ? (te("Url Parameter Found so init with specific model", n),
                    e.value = n) : (te("No Url Parameter Found"),
                    e.value = BASE_MODELS[0].id)
                }
            } else {
                for (let t = 0; t < BASE_MODELS.length; t++) {
                    const n = document.createElement("option");
                    n.text = BASE_MODELS[t].name ? ct(BASE_MODELS[t].name) : BASE_MODELS[t].id,
                    n.value = BASE_MODELS[t].id,
                    e.add(n)
                }
                const n = t.get("model");
                n ? (te("Url Parameter Found so init with specific model", n),
                e.value = n) : te("No Url Parameter Found")
            }
        }
        if (CONFIGURATION.DEV_VERSION) {
            const e = document.createElement("p");
            e.innerText = "Version: " + CONFIGURATION.DEV_VERSION,
            A.appendChild(e);
            const t = document.createElement("button");
            t.id = "dev-button",
            t.innerText = "DOWNLOAD HERE",
            A.appendChild(t),
            t.onclick = ()=>{
                oe("GLB export clicked"),
                async function() {
                    const e = Qe()
                      , t = await e.exportScene()
                      , n = new File([t],"export.glb")
                      , o = document.createElement("a");
                    o.download = n.name,
                    o.href = URL.createObjectURL(n),
                    o.click()
                }()
            }
        }
        if (CONFIGURATION.api && async function(e, t, n) {
            if ("seiseralm" === e) {
                let e;
                rt().includes("de") ? (te("Seiseralm Language German"),
                e = "") : rt().includes("it") ? (te("Language Czech"),
                e = "it/") : (te("Seiseralm Language English"),
                e = "en/");
                const t = await (o = "https://www.seiseralm-dolomites.com/" + e + "getdata.xml",
                new Promise(((e,t)=>{
                    dt(o, 3).then((function(e) {
                        return e.text()
                    }
                    )).then((function(t) {
                        e(JSON5.parse(xml2json(function(e) {
                            var t = null;
                            if (window.DOMParser)
                                try {
                                    t = (new DOMParser).parseFromString(e, "text/xml")
                                } catch (e) {
                                    t = null
                                }
                            else if (window.ActiveXObject)
                                try {
                                    (t = new ActiveXObject("Microsoft.XMLDOM")).async = !1,
                                    t.loadXML(e) || window.alert(t.parseError.reason + t.parseError.srcText)
                                } catch (e) {
                                    t = null
                                }
                            else
                                alert("cannot parse xml string!");
                            return t
                        }(t)).replace("undefined", "")))
                    }
                    )).catch((function(e) {
                        ae("Error in fetching URL" + e),
                        t(e)
                    }
                    ))
                }
                )));
                await et();
                const i = await Ce();
                ne("seiseralmAPI", t),
                ne("seiseralmAPI ( materials)", await Ce()),
                ROUTE_DATA = {
                    0: {
                        group: "sehr leicht",
                        data: []
                    },
                    1: {
                        group: "leicht",
                        data: []
                    },
                    2: {
                        group: "einfach",
                        data: []
                    },
                    3: {
                        group: "normal",
                        data: []
                    },
                    4: {
                        group: "anspruchsvoll",
                        data: []
                    },
                    5: {
                        group: "schwer",
                        data: []
                    },
                    6: {
                        group: "sehr schwer",
                        data: []
                    }
                };
                for (let e = 0; e < i.length; e++) {
                    const n = i[e];
                    for (let e = 0; e < t.touren.item.length; e++) {
                        const o = t.touren.item[e];
                        if (n.name && n.name.includes(o.uid)) {
                            ROUTE_DATA[o.rating].data.push({
                                tour: o,
                                material: n
                            }),
                            Te(n.index);
                            break
                        }
                    }
                }
                ne("Extracted route data", ROUTE_DATA);
                const s = document.getElementById("productSelector");
                let r;
                s.onchange = ()=>{
                    const e = s.options[s.selectedIndex];
                    ne("Changed Route Data: ", e.attributes),
                    ne("Changed Route Data (key): ", e.attributes[1].value),
                    ne("Changed Route Data: ", e.attributes[2].value),
                    a = s.value;
                    const t = e.attributes[1].value
                      , n = e.attributes[2].value;
                    Object.keys(ROUTE_DATA).forEach((e=>{
                        if (ROUTE_DATA[e].data.length > 0)
                            for (let o = 0; o < ROUTE_DATA[e].data.length; o++) {
                                const a = ROUTE_DATA[e].data[o];
                                if (e == t && o == n) {
                                    let e = tt();
                                    const t = (a.tour.distance / 1e3).toFixed(1)
                                      , n = "1" === a.tour.isOpen;
                                    e.callToAction.subtitle = {
                                        de: `${t} km / ${a.tour.hm}hm\n` + (n ? "🟢 OFFEN" : "🔴 GESPERRT"),
                                        en: `${t} km / ${a.tour.hm}hm\n` + (n ? "🟢 OPEN" : "🔴 CLOSED")
                                    },
                                    e.callToAction.callback = a.tour.link,
                                    $e(e),
                                    We(a.material.index, n ? [0, 1, 0, 1] : [1, 0, 0, 1])
                                } else
                                    Te(a.material.index)
                            }
                    }
                    ))
                }
                ,
                Object.keys(ROUTE_DATA).forEach((e=>{
                    if (ne("Key : " + e, ROUTE_DATA[e].data),
                    ne("LANG_RES.addRes", Z.addRes),
                    ROUTE_DATA[e].data.length > 0) {
                        const t = ct(Z.addRes[e])
                          , n = document.createElement("optgroup");
                        n.label = t;
                        for (let t = 0; t < ROUTE_DATA[e].data.length; t++) {
                            const o = ROUTE_DATA[e].data[t]
                              , a = document.createElement("option");
                            a.text = o.tour.title,
                            a.value = o.tour.uid,
                            a.setAttribute("key", e),
                            a.setAttribute("idx", t),
                            n.appendChild(a),
                            r || (r = o.tour.uid)
                        }
                        s.add(n)
                    }
                }
                ));
                const c = n.get("api");
                c ? (te("Url Parameter Found so init with specific route", c),
                s.value = c) : (te("No Url Parameter Found"),
                r && (s.value = r)),
                s.onchange()
            }
            var o
        }(CONFIGURATION.api, 0, t),
        CONFIGURATION.colorSelector) {
            const e = t.get("color");
            e ? (ne("Prefill Color detected", e),
            he(!1, e)) : he(!1)
        } else if (CONFIGURATION.textureSelector) {
            const e = t.get("texture");
            e ? (ne("Prefill Texture detected", e),
            he(!1, void 0, e)) : he(!1)
        } else
            he(!1);
        const Ht = document.getElementById("qr-modal")
          , Vt = document.getElementById("unsupported-browser-modal")
          , jt = document.getElementById("failed-modal")
          , zt = document.getElementById("ar-world-modal")
          , Wt = document.getElementById("permission-modal");
        window.onclick = function(e) {
            e.target == Ht && (Ht.style.display = "none"),
            e.target == Vt && (Vt.style.display = "none"),
            e.target == jt && (jt.style.display = "none"),
            e.target == zt && (zt.style.display = "none"),
            e.target == Wt && (Wt.style.display = "none")
        }
        ,
        document.getElementById("scroll-hint").addEventListener("wheel", (e=>{
            const t = Qe();
            if (t && t.model) {
                const n = new e.constructor(e.type,e);
                t.shadowRoot.querySelector(".userInput").dispatchEvent(n)
            }
        }
        )),
        setInterval((()=>{
            !function() {
                const e = Qe();
                e && i !== e.model && (i = e.model,
                He())
            }()
        }
        ), 200),
        CONFIGURATION.trackExperience && (v.DISABLE_IMPRESSION_TRACKING || setInterval((()=>{
            !function() {
                if (b && 0 !== W.length) {
                    const e = CONFIGURATION.customer.replace(/\s/g, "_")
                      , t = CONFIGURATION.project.replace(/\s/g, "_")
                      , n = new XMLHttpRequest;
                    n.onreadystatechange = function() {
                        4 == n.readyState && 200 == n.status && te("Experience data successfully sent.")
                    }
                    ,
                    te("Trying to send experience data"),
                    ne("Trying to send experience data", {
                        customer: e,
                        user: j,
                        project: t,
                        movements: W
                    });
                    const o = D;
                    n.open("POST", o, !0),
                    n.setRequestHeader("Content-type", "application/json"),
                    n.send(JSON.stringify({
                        user: j,
                        projectUID: PROJECT_UID,
                        movements: W
                    })),
                    W = []
                }
            }()
        }
        ), 5e3)),
        CONFIGURATION.lazyLoad && (A.addEventListener("mouseover", ce, {
            once: !0
        }),
        A.addEventListener("touchmove", ce, {
            once: !0
        }),
        A.addEventListener("mousemove", ce, {
            once: !0
        }),
        A.addEventListener("scroll", ce, {
            once: !0
        }),
        A.addEventListener("keydown", ce, {
            once: !0
        }))
    }
    function se(e, t) {
        if (t)
            "neutral" === t ? e.setAttribute("environment-image", "neutral") : e.setAttribute("environment-image", "legacy");
        else if (CONFIGURATION.customEnvironment) {
            const t = CONFIGURATION.customEnvironment.includes("blob:") || CONFIGURATION.customEnvironment.includes("http") || CONFIGURATION.customEnvironment.includes("C:\\") ? CONFIGURATION.customEnvironment : E + CONFIGURATION.customEnvironment;
            e.setAttribute("environment-image", t)
        } else if (CONFIGURATION.environmentImage) {
            const t = CONFIGURATION.environmentImage.includes("blob:") || CONFIGURATION.environmentImage.includes("http") || CONFIGURATION.environmentImage.includes("C:\\") ? CONFIGURATION.environmentImage : v.BASE_PATH + "img/environment/" + CONFIGURATION.environmentImage;
            e.setAttribute("environment-image", t)
        } else
            CONFIGURATION.environmentNeutral ? e.setAttribute("environment-image", "neutral") : e.setAttribute("environment-image", "legacy");
        CONFIGURATION.hdrType && e.setAttribute("hdr-type", CONFIGURATION.hdrType)
    }
    function re() {
        ne("Session refreshed"),
        z = (new Date).getTime() + "X",
        SESSION = "?session=" + function(e) {
            let t, n = 1540483477, o = 24, a = [0, 0, 0, 0];
            for (let i = 0; i < e.length; i += 4)
                t = e.charCodeAt(i) + (e.charCodeAt(i + 1) << 8) + (e.charCodeAt(i + 2) << 16) + (e.charCodeAt(i + 3) << 24),
                t *= n,
                t ^= t >>> o,
                t *= n,
                a[0] *= n,
                a[0] ^= t,
                a[1] *= n,
                a[1] ^= t >>> 16,
                a[2] *= n,
                a[2] ^= t >>> 32,
                a[3] *= n,
                a[3] ^= t >>> 48;
            switch (t = 0,
            3 & e.length) {
            case 3:
                t ^= e.charCodeAt(e.length - 1) << 16;
            case 2:
                t ^= e.charCodeAt(e.length - 2) << 8;
            case 1:
                t ^= e.charCodeAt(e.length - 3),
                t *= n,
                t ^= t >>> o,
                t *= n,
                a[0] *= n,
                a[0] ^= t,
                a[1] *= n,
                a[1] ^= t >>> 16,
                a[2] *= n,
                a[2] ^= t >>> 32,
                a[3] *= n,
                a[3] ^= t >>> 48
            }
            return a[0] ^= e.length,
            a[1] ^= e.length >>> 16,
            a[2] ^= e.length >>> 32,
            a[3] ^= e.length >>> 48,
            a[0] *= n,
            a[1] *= n,
            a[2] *= n,
            a[3] *= n,
            a[0] ^= a[0] >>> 13,
            a[1] ^= a[1] >>> 13,
            a[2] ^= a[2] >>> 13,
            a[3] ^= a[3] >>> 13,
            a[0] *= n,
            a[1] *= n,
            a[2] *= n,
            a[3] *= n,
            a[0] ^= a[0] >>> 15,
            a[1] ^= a[1] >>> 15,
            a[2] ^= a[2] >>> 15,
            a[3] ^= a[3] >>> 15,
            (a[0] >>> 0).toString(16) + (a[1] >>> 0).toString(16) + (a[2] >>> 0).toString(16) + (a[3] >>> 0).toString(16)
        }(function(e, t) {
            let n = "OPgfospodfO_KXCJ213*const 5000:int"
              , o = "UguZDBSgtvf-scriptCaller()globalThis.runmode=3"
              , a = t
              , i = e
              , s = function() {
                const e = new Date
                  , t = new Date(Date.UTC(e.getUTCFullYear(), 0, 1))
                  , n = e - t + 60 * (t.getTimezoneOffset() - e.getTimezoneOffset()) * 1e3
                  , o = 864e5;
                return Math.floor(n / o)
            }()
              , r = ""
              , c = 0;
            for (; ; ) {
                switch (c) {
                case 0:
                    r += n,
                    c = 1;
                    break;
                case 1:
                    r += o,
                    c = 2;
                    break;
                case 2:
                    r += a,
                    c = 3;
                    break;
                case 3:
                    r += i,
                    c = 4;
                    break;
                case 4:
                    r += s,
                    c = 0
                }
                if (0 === c)
                    break
            }
            return r
        }(PROJECT_UID, z)) + "&user=" + z
    }
    function ce() {
        const e = Qe();
        e && e.dismissPoster()
    }
    function le(e, t, n) {
        return new Promise(((o,a)=>{
            dt(n, 3).then((function(e) {
                return e.blob()
            }
            )).then((async n=>{
                const a = await n.arrayBuffer();
                te("Downloaded blob", a);
                const i = new Uint8Array(a);
                for (let t = e; t < e + e; t++)
                    i[t] = i[t] - t;
                for (let n = t; n < t + e; n++)
                    i[n] = i[n] - n;
                const s = new Blob([a]);
                te("Downloaded blob (uint8)", i);
                const r = URL.createObjectURL(s);
                te("blobURL", r),
                o(r)
            }
            )).catch((function(e) {
                ae("Error in fetching URL" + e),
                a(e)
            }
            ))
        }
        ))
    }
    function de(e) {
        return new Promise(((t,n)=>{
            dt(e, 3).then((function(e) {
                return e.text()
            }
            )).then((function(e) {
                const n = JSON5.parse(e);
                t(n)
            }
            )).catch((function(e) {
                ae("Error in fetching URL" + e),
                n(e)
            }
            ))
        }
        ))
    }
    function me(e) {
        document.getElementById("metamask-waiting-container").style.display = e ? "block" : "none"
    }
    function ue() {
        L = !0
    }
    function pe(e, t, n) {
        ot(!1),
        me(!1);
        const o = document.createElement("div");
        o.classList.add("web3-error-container");
        const a = document.createElement("p");
        a.classList.add("helvetica", "web3-error-txt");
        const i = document.createElement("button");
        i.classList.add("web3-error-btn", "helvetica"),
        "OWNERSHIP_NOT_MATCHING" === t ? (te("Ownership verification not matching"),
        a.innerText = ct(Z.web3Errors.OWNERSHIP_NOT_MATCHING.hint),
        i.innerText = ct(Z.web3Errors.OWNERSHIP_NOT_MATCHING.action),
        i.onclick = ()=>{
            Ee("https://opensea.io/assets/" + n.web3_contract_id + "/" + n.web3_token_id)
        }
        ) : "METAMASK_NOT_INSTALLED" === t && (te("Metamask not installed"),
        a.innerText = ct(Z.web3Errors.METAMASK_NOT_INSTALLED.hint),
        i.innerText = ct(Z.web3Errors.METAMASK_NOT_INSTALLED.action),
        i.onclick = ()=>{
            Ee("https://metamask.io/")
        }
        );
        const s = document.createElement("button");
        s.classList.add("web3-error-btn", "web3-back-btn", "helvetica"),
        s.innerText = ct(Z.web3Errors.ACTION_BACK),
        s.onclick = ()=>{
            window.location.reload()
        }
        ,
        o.appendChild(a),
        o.appendChild(i),
        o.appendChild(s),
        e.appendChild(o)
    }
    function Ee(e) {
        const t = document.createElement("a");
        t.setAttribute("href", e),
        t.target = "_blank",
        t.click()
    }
    function he(e, n, o) {
        re(),
        e ? te("Switch Model from Select", e) : te("Switch Model from Non Select");
        const a = Qe();
        if (!a)
            return;
        a.removeEventListener("model-visibility", He),
        a.removeEventListener("model-visibility", Le),
        a.removeEventListener("camera-change", Ye),
        a.removeEventListener("quick-look-button-tapped", Re),
        a.removeEventListener("ar-status", we),
        R = {
            interactedWithCameraView: void 0,
            lastClickedHotspot: void 0
        };
        let i = tt();
        if (i) {
            if (CONFIGURATION.thirdPartyViewerOverlay) {
                const e = document.getElementById("third-party-iframe");
                i.thirdPartyViewerURL ? (e.src = i.thirdPartyViewerURL,
                a.style.visibility = "hidden",
                e.style.visibility = "visible") : (e.src = "",
                e.style.visibility = "hidden",
                a.style.visibility = "visible")
            }
            if (i.overrideEnvironment && se(a, i.overrideEnvironment),
            "simple" === v.CALL_TO_ACTION_TYPE && ($e(i),
            a.addEventListener("quick-look-button-tapped", Re),
            v.INTEGRATION_ACTIVE && (s ? (ne("Prevent notify from model once"),
            s = !1) : ye("SWITCH_MODEL"))),
            b !== i && ot(!0),
            b = i,
            CONFIGURATION.productSelector && "images" === v.PRODUCT_SELECTOR_TYPE)
                for (let e = 0; e < q.length; e++)
                    q[e].classList.remove("active"),
                    q[e].id === i.id && q[e].classList.add("active");
            let r, d;
            if (qe(i.id, "load_model_3d"),
            v.INTEGRATION_ACTIVE && ye("MODEL_3D_LOADED"),
            e ? (ne("LOAD LISTENER"),
            a.addEventListener("model-visibility", He)) : (ne("VISIBILITY LISTENER"),
            a.addEventListener("model-visibility", He)),
            a.addEventListener("model-visibility", Le),
            a.addEventListener("ar-status", we),
            CONFIGURATION.trackExperience && a.addEventListener("camera-change", Ye),
            i.orbit.includes("m")) {
                const e = i.orbit.split(" ");
                r = e[0] + " " + e[1] + " auto"
            }
            if (r || (r = i.orbit),
            a.cameraOrbit = r,
            i.orbitRange ? (a.minCameraOrbit = i.orbitRange.min,
            a.maxCameraOrbit = i.orbitRange.max) : (a.minCameraOrbit = "auto auto auto",
            a.maxCameraOrbit = "auto auto auto"),
            w.cameraTarget && (a.cameraTarget = "auto auto auto"),
            i.shadowIntensity ? a.setAttribute("shadow-intensity", i.shadowIntensity) : a.setAttribute("shadow-intensity", "0"),
            i.poster && (a.poster = i.poster.includes("blob:") ? i.poster : c + i.poster),
            !PROJECT_ACTIVE)
                return ot(!1),
                void function() {
                    const e = document.getElementById("control-ar-btn");
                    e && e.remove();
                    const t = document.getElementById("project-deactivation-notice");
                    t && (t.style.display = "block")
                }();
            if (ne("TEST", i.glb.includes("https:")),
            a.src = i.glb.includes("blob:") || i.glb.includes("https:") ? i.glb : mt(c + i.glb) + f.android,
            ne("TEST", a.src),
            i.usdz && !v.USDZ_CONVERSION_INTEGRATED && (a.iosSrc = c + i.usdz + "#" + Be(!0)),
            i.sound) {
                d = document.createElement("audio");
                const e = document.createElement("source");
                e.src = i.sound.includes("blob:") ? i.sound : m + i.sound,
                d.appendChild(e),
                a.appendChild(d)
            }
            if (i.video && async function(e, t) {
                await new Promise((async e=>{
                    for (; !L; )
                        await st(200);
                    e()
                }
                )),
                await et(),
                ne(" startVideoPlaybackRoutine ");
                const n = ge(e)
                  , o = Ne(await Ae(n, t.video.mesh))
                  , a = e.model.getMaterialByName(o.name)
                  , {baseColorTexture: i} = a.pbrMetallicRoughness
                  , s = t.video.file.includes("blob:") ? t.video.file : u + t.video.file
                  , r = e.createVideoTexture(s);
                i.setTexture(r.modelViewerTexture),
                a.emissiveTexture.setTexture(r.modelViewerTexture),
                be(e)
            }(a, i),
            i.gif && Ie(a, i.gif.mesh, i.gif.file),
            i.multimedia && async function(e, t) {
                await et(),
                ne(" startMultimediaPlaybackRoutine ");
                const n = ge(e)
                  , o = []
                  , a = []
                  , i = [];
                for (let s = 0; s < t.multimedia.media.length; s++) {
                    const r = t.multimedia.media[s];
                    if ("video" === r.type) {
                        const a = Ne(await Ae(n, r.mesh));
                        ne(" startVideoPlaybackRoutine multi");
                        const i = e.model.getMaterialByName(a.name)
                          , {baseColorTexture: s} = i.pbrMetallicRoughness
                          , c = r.file.includes("blob:") ? r.file : u + r.file
                          , l = e.createVideoTexture(c, !t.multimedia.autoplay);
                        s.setTexture(l.modelViewerTexture),
                        i.emissiveTexture.setTexture(l.modelViewerTexture),
                        be(e),
                        l && o.push(l.videoElement)
                    }
                    if ("gif" === r.type)
                        i.push(r);
                    else if ("audio" === r.type) {
                        const t = document.createElement("audio")
                          , n = document.createElement("source");
                        n.src = r.file.includes("blob:") ? r.file : m + r.file,
                        t.loop = !0,
                        t.appendChild(n),
                        e.appendChild(t),
                        t && a.push(t)
                    }
                }
                if (t.multimedia.autoplay) {
                    for (let e = 0; e < videoPlayers.length; e++)
                        videoPlayers[e].play();
                    for (let e = 0; e < a.length; e++)
                        a[e].play();
                    for (let t = 0; t < i.length; t++)
                        Ie(e, i[t].mesh, i[t].file)
                } else {
                    e.interactionPrompt = "none";
                    const t = e.autoRotate;
                    e.autoRotate = void 0;
                    const n = document.createElement("div");
                    n.classList.add("web-ar-play-container");
                    const s = document.createElement("img");
                    s.classList.add("web-ar-play-circle"),
                    s.src = v.BASE_PATH + "img/play-circle.png",
                    n.appendChild(s),
                    e.appendChild(n),
                    n.onclick = async()=>{
                        n.style.display = "none",
                        e.interactionPrompt = "auto",
                        e.autoRotate = t,
                        e.autoplay = !0;
                        for (let e = 0; e < o.length; e++)
                            o[e].play();
                        for (let e = 0; e < a.length; e++)
                            a[e].play();
                        for (let t = 0; t < i.length; t++)
                            Ie(e, i[t].mesh, i[t].file)
                    }
                }
                setInterval((()=>{
                    be(e)
                }
                ), 72)
            }(a, i),
            i.animation)
                if (a.animationName = i.animation,
                i.multimedia && !i.multimedia.autoPlay)
                    a.autoplay = !1;
                else if (i.specialAnimationSettings && i.specialAnimationSettings.promptAnimationPlay) {
                    a.autoplay = !1;
                    const e = document.createElement("div");
                    e.classList.add("web-ar-play-container");
                    const t = document.createElement("img");
                    t.classList.add("web-ar-play-circle"),
                    t.src = v.BASE_PATH + "img/play-circle.png",
                    e.appendChild(t),
                    a.appendChild(e),
                    a.interactionPrompt = "none";
                    const n = document.createElement("img");
                    n.classList.add("web-ar-restart-circle"),
                    n.src = v.BASE_PATH + "img/restart.png",
                    a.appendChild(n),
                    a.addEventListener("finished", (()=>{
                        console.log("Finished animation was triggered"),
                        n.style.display = "block"
                    }
                    )),
                    n.onclick = ()=>{
                        n.style.display = "none",
                        d && d.play(),
                        a.play({
                            repetitions: 1
                        })
                    }
                    ,
                    e.onclick = ()=>{
                        e.style.display = "none",
                        d && (d.play(),
                        d.addEventListener("timeupdate", (()=>{}
                        ))),
                        a.play({
                            repetitions: 1
                        })
                    }
                } else
                    i.sound && (d.loop = !0,
                    d.play()),
                    a.autoplay = !0;
            else
                a.autoplay = !1,
                a.animationName = void 0,
                i.sound && (d.loop = !0,
                d.play());
            if (CONFIGURATION.baseFieldOfView && (v.FIELD_OF_VIEW = CONFIGURATION.baseFieldOfView),
            CONFIGURATION.baseMaxFieldOfView && (v.MAX_FIELD_OF_VIEW = CONFIGURATION.baseMaxFieldOfView),
            CONFIGURATION.baseMinFieldOfView && (v.MIN_FIELD_OF_VIEW = CONFIGURATION.baseMinFieldOfView),
            a.fieldOfView = i.fieldOfView ? i.fieldOfView : v.FIELD_OF_VIEW,
            a.maxFieldOfView = i.maxFieldOfView ? i.maxFieldOfView : v.MAX_FIELD_OF_VIEW,
            a.minFieldOfView = i.minFieldOfView ? i.minFieldOfView : v.MIN_FIELD_OF_VIEW,
            Number(CONFIGURATION.baseExposure) && (v.EXPOSURE = CONFIGURATION.baseExposure),
            Number(CONFIGURATION.baseMetallic) && (v.METALLIC = CONFIGURATION.baseMetallic),
            Number(CONFIGURATION.baseRoughness) && (v.ROUGHNESS = CONFIGURATION.baseRoughness),
            CONFIGURATION.colorSelector) {
                const e = document.getElementById("color-container");
                e.innerHTML = "",
                X = [];
                for (let t = 0; t < i.colors.length; t++) {
                    ne("Add color: ", i.colors[t]);
                    const o = document.createElement("span");
                    o.classList.add("dot"),
                    o.classList.add("no-highlight-click"),
                    ne("Background color", lt(i.colors[t])),
                    o.style.backgroundColor = "rgb(" + lt(i.colors[t]) + ")",
                    o.addEventListener("click", (function() {
                        Ve(!0, i.colors[t], i.materialIndex, t)
                    }
                    )),
                    e.appendChild(o),
                    o.value = t,
                    X.push(o),
                    n && Number(n) === t && setTimeout((async()=>{
                        await et(),
                        await st(300),
                        Ve(!1, i.colors[t], i.materialIndex, t)
                    }
                    ), 0)
                }
                CONFIGURATION.hideColorSelector && (document.getElementById("color-selector-container").style.display = "none")
            }
            if (CONFIGURATION.textureSelector) {
                const e = document.getElementById("texture-container");
                if (e.innerHTML = "",
                "dropdown" === CONFIGURATION.textureSelectorAppearance) {
                    for (let n = 0; n < i.textures.length; n++) {
                        const a = document.createElement("option");
                        a.text = i.textures[n].name ? ct(i.textures[n].name) : i.textures[n].id,
                        a.value = n,
                        e.add(a),
                        o && Number(o) === n && setTimeout((async()=>{
                            await et(),
                            await st(300),
                            nt(!1, i, n),
                            e.value = n,
                            t = n
                        }
                        ), 0)
                    }
                    e.onchange = e=>{
                        t = e.target.value,
                        nt(!0, i, e.target.value)
                    }
                } else {
                    J = [];
                    for (let t = 0; t < i.textures.length; t++) {
                        ne("Add Texture: ", i.textures[t]);
                        const n = document.createElement("img");
                        n.src = i.textures[t].preview.includes("blob:") ? i.textures[t].preview : c + "textures/" + i.textures[t].preview,
                        n.id = i.textures[t].id,
                        n.addEventListener("click", (function() {
                            nt(!0, i, t)
                        }
                        )),
                        n.classList.add("material-selection"),
                        n.classList.add("no-highlight-click"),
                        e.appendChild(n),
                        J.push(n),
                        o && Number(o) === t && setTimeout((async()=>{
                            await et(),
                            await st(300),
                            nt(!1, i, t)
                        }
                        ), 0)
                    }
                }
                CONFIGURATION.hideColorSelector && (document.getElementById("color-selector-container").style.display = "none")
            }
            if (i.singleTexture || i.advancedTexture) {
                const e = i.singleTexture ? i.singleTexture : i.advancedTexture[0]
                  , t = e.image.includes("blob:") ? e.image : l + e.image
                  , n = i.singleTexture ? i.singleTexture.materialIdx : i.advancedTexture[0].material.index;
                setTimeout((async()=>{
                    await et();
                    const e = await a.createTexture(t);
                    a.model.materials[n].pbrMetallicRoughness.baseColorTexture.setTexture(e)
                }
                ), 0)
            }
            CONFIGURATION.hotspots && Oe(i),
            CONFIGURATION.dimensions && function(e) {
                const t = [{
                    slot: "hotspot-dot+X-Y+Z",
                    className: "dot",
                    dataPosition: "-1 -1 0",
                    dataNormal: "0 0 1"
                }, {
                    slot: "hotspot-dim+X-Y",
                    className: "dim",
                    dataPosition: "-1 0 -1",
                    dataNormal: "-1 0 0"
                }, {
                    slot: "hotspot-dot+X-Y-Z",
                    className: "dot",
                    dataPosition: "1 -1 -1",
                    dataNormal: "-1 0 0"
                }, {
                    slot: "hotspot-dim+Y-Z",
                    className: "dim",
                    dataPosition: "-1 -1 0",
                    dataNormal: "0 0 1"
                }, {
                    slot: "hotspot-dot-X+Y-Z",
                    className: "dot",
                    dataPosition: "-1 1 -1",
                    dataNormal: "-1 0 0"
                }, {
                    slot: "hotspot-dim-X-Z",
                    className: "dim",
                    dataPosition: "-1 0 -1",
                    dataNormal: "-1 0 0"
                }, {
                    slot: "hotspot-dot-X-Y+Z",
                    className: "dot",
                    dataPosition: "-1 -1 0",
                    dataNormal: "-1 0 1"
                }];
                for (let n = 0; n < t.length; n++) {
                    const o = t[n]
                      , a = document.querySelector(`[slot="${o.slot}"]`);
                    a && a.remove();
                    const i = document.createElement("button");
                    i.setAttribute("slot", o.slot),
                    i.setAttribute("className", o.className),
                    i.classList.add("helvetica"),
                    i.classList.add("dimension-" + o.className),
                    i.setAttribute("data-position", o.dataPosition),
                    i.setAttribute("data-normal", o.dataNormal),
                    e.appendChild(i)
                }
                e.addEventListener("load", (()=>{
                    fe(e)
                }
                ))
            }(a)
        }
        a.shadowRoot.querySelector(".userInput").setAttribute("style", "outline: none !important;")
    }
    function Te(e) {
        const t = Qe().model.materials;
        t[e].setAlphaMode("BLEND"),
        t[e].pbrMetallicRoughness.setBaseColorFactor([0, 0, 0, -1])
    }
    function Oe(e) {
        const t = Qe()
          , n = document.getElementsByClassName("general-hotspot");
        for (; n.length > 0; )
            n[0].remove();
        if (S = [],
        e.hotspots)
            for (let n = 0; n < e.hotspots.length; n++)
                Ze(e.hotspots[n], n, e, t)
    }
    async function Ie(e, t, n) {
        ne(" startGifPlayback "),
        await et();
        const o = ge(e)
          , a = await Ae(o, t)
          , i = Ne(a)
          , s = i.map?.image
          , r = document.createElement("canvas");
        r.class = "animation-canvas",
        r.width = s.width,
        r.height = s.height;
        const c = n.includes("blob:") ? n : p + n
          , l = new THREE.CanvasTexture(r);
        i.map ? (l.flipY = i.map.flipY,
        l.wrapS = i.map.wrapS,
        l.wrapT = i.map.wrapT,
        l.encoding = i.map.encoding) : (l.flipY = !1,
        l.wrapS = THREE.RepeatWrapping,
        l.wrapT = THREE.RepeatWrapping,
        l.encoding = THREE.LinearEncoding),
        l.minFilter = THREE.LinearFilter,
        l.magFilter = THREE.LinearFilter,
        l.format = THREE.RGBAFormat,
        i.colorWrite = !1,
        a.material = new THREE.MeshBasicMaterial({
            map: l,
            side: THREE.DoubleSide,
            transparent: !0
        }),
        gifFrames({
            url: c,
            frames: "all",
            outputType: "canvas"
        }).then((async e=>{
            const t = [];
            for (let n = 0; n < e.length; n++)
                t.push(e[n].getImage());
            const n = r.getContext("2d");
            let o = 0;
            for (; ; )
                n.clearRect(0, 0, r.width, r.height),
                n.drawImage(e[o].getImage(), 0, 0, r.width, r.height),
                l.needsUpdate = !0,
                await st(50),
                o++,
                o >= t.length && (o = 0)
        }
        )).catch(console.error.bind(console)),
        setInterval((()=>{
            be(e)
        }
        ), 50)
    }
    function ge(e) {
        return e[Object.getOwnPropertySymbols(e).find((e=>"scene" === e.description))].children[0].children[0]
    }
    function Ce() {
        return new Promise((async e=>{
            const t = Qe()
              , n = [];
            for (let e = 0; e < t.model.materials.length; e++)
                n.push({
                    index: t.model.materials[e].index,
                    name: t.model.materials[e].name
                });
            e(n)
        }
        ))
    }
    function Ae(e, t) {
        return new Promise((async n=>{
            let o = null;
            e.traverse((e=>{
                e.isMesh && e.name === t && (o = e)
            }
            )),
            n(o)
        }
        ))
    }
    function Ne(e) {
        const t = e.material;
        if (!t)
            throw new Error("Mesh does not have a material");
        if (Array.isArray(t))
            throw new Error("Mesh has multiple materials");
        return t
    }
    function be(e) {
        e[Object.getOwnPropertySymbols(e).find((e=>"scene" === e.description))].isDirty = !0
    }
    function fe(e, t) {
        const n = e.getCameraTarget();
        let o;
        o = t || e.getDimensions();
        const a = e.getDimensions();
        te("updateDimensions", {
            center: n,
            size: a
        });
        const i = a.x / 2
          , s = a.y / 2
          , r = a.z / 2;
        e.updateHotspot({
            name: "hotspot-dot+X-Y+Z",
            position: `${n.x + i} ${n.y - s} ${n.z + r}`
        }),
        e.updateHotspot({
            name: "hotspot-dim+X-Y",
            position: `${n.x - i} ${n.y - s} ${n.z}`
        });
        const c = `${(100 * o.z).toFixed(0)} cm`;
        "0 cm" !== c && (e.querySelector('button[slot="hotspot-dim+X-Y"]').textContent = c),
        e.updateHotspot({
            name: "hotspot-dot+X-Y-Z",
            position: `${n.x - i} ${n.y - s} ${n.z - r}`
        }),
        e.updateHotspot({
            name: "hotspot-dim+Y-Z",
            position: `${n.x} ${n.y - s} ${n.z + r}`
        });
        const l = `${(100 * o.x).toFixed(0)} cm`;
        "0 cm" !== l && (e.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent = l),
        e.updateHotspot({
            name: "hotspot-dot-X+Y-Z",
            position: `${n.x - i} ${n.y + s} ${n.z - r}`
        }),
        e.updateHotspot({
            name: "hotspot-dim-X-Z",
            position: `${n.x - i} ${n.y} ${n.z - r}`
        });
        const d = `${(100 * o.y).toFixed(0)} cm`;
        "0 cm" !== d && (e.querySelector('button[slot="hotspot-dim-X-Z"]').textContent = d),
        e.updateHotspot({
            name: "hotspot-dot-X-Y+Z",
            position: `${n.x - i} ${n.y - s} ${n.z + r}`
        })
    }
    function Re() {
        const e = tt();
        Ke(!0),
        "simple" === v.CALL_TO_ACTION_TYPE && window.open(e.callToAction.callback, "_blank").focus()
    }
    function ye(o) {
        const a = tt();
        setTimeout((()=>{
            window.top.postMessage({
                type: o,
                value: {
                    model: a,
                    textureIdx: t,
                    colorIdx: e,
                    modelIdx: n
                }
            }, "*"),
            te("Notify Integration", o)
        }
        ), 100)
    }
    function Le() {
        if (Y && (Y = !1,
        setTimeout((async()=>{
            if (Ue(!0),
            setTimeout((()=>{
                De()
            }
            ), 2e3),
            !r && !_e()) {
                const e = location.href.replace("&autoStart=true", "");
                window.history.pushState("object", document.title, e)
            }
        }
        ), 2e3)),
        o) {
            if (ve()) {
                const e = location.origin + "/" + PROJECT_NAME + "/?otlc=" + o;
                window.history.pushState("object", document.title, e)
            } else if (!location.href.includes("otlc")) {
                const e = location.href + "&otlc=" + o;
                window.history.pushState("object", document.title, e)
            }
        } else if (!document.location.host.includes("localhost:") && !ee(document.location.host) && r && !_e()) {
            const e = "https://" + document.location.host + "/" + r;
            ne("Beautyful URL", e),
            window.history.pushState("object", document.title, e)
        }
        CONFIGURATION.variantMode && ne("Variants", Qe().availableVariants),
        b && (w.cameraTarget = Qe().cameraTarget,
        w.cameraOrbit = Qe().cameraOrbit,
        w.minCameraOrbit = Qe().minCameraOrbit)
    }
    function ve() {
        for (let e = 0; e < O.length; e++)
            if (location.host.includes(O[e]))
                return oe("special url detected detected"),
                !0;
        return !1
    }
    function we(e) {
        "failed" === e.detail.status && (ae("Failed to start AR", JSON.stringify(e.detail)),
        Fe(),
        Xe("ar-start-failed"),
        Se())
    }
    function Se() {
        const e = document.getElementById("failed-modal");
        document.getElementById("failed-modal-close").onclick = function() {
            e.style.display = "none"
        }
        ,
        e.style.display = "block"
    }
    function _e() {
        try {
            return window.self !== window.top
        } catch (e) {
            return !0
        }
    }
    async function xe() {
        it(),
        _e(),
        ke(),
        await st(300),
        Xe("ar-load-ok"),
        document.getElementById("hidden-ar-btn").click()
    }
    function Ue(n=!1) {
        if (v.EDITOR_ACTIVE)
            !function() {
                const e = document.getElementById("ar-world-modal");
                document.getElementById("ar-world-modal-close").onclick = function() {
                    e.style.display = "none"
                }
                ,
                e.style.display = "block"
            }();
        else {
            if (v.INTEGRATION_ACTIVE && ye("AR_BUTTON_CLICK"),
            v.GLASS_TRY_ON) {
                let e;
                e = _e() ? window.self.document.getElementById("glass-iframe") : document.getElementById("glass-iframe"),
                te("glassIframe", e),
                window.onmessage = async t=>{
                    if (t.data)
                        switch (ne("Event from fine tuner received", t.data.type),
                        ne("Event from fine tuner received (full event)", t.data),
                        t.data.type) {
                        case "WAITING_AUTH":
                            e.contentWindow.postMessage({
                                type: "AUTH_TRY_ON",
                                value: {
                                    customer_uid: CUSTOMER_UID,
                                    product_uid: PROJECT_UID
                                }
                            }, "*");
                            break;
                        case "AUTH_SUCCESS":
                            let t = tt();
                            const n = Qe()
                              , o = await n.exportScene();
                            e.contentWindow.postMessage({
                                type: "LOAD_MODEL",
                                value: {
                                    settings: t.fineTuneGlassTryOn,
                                    glb: o
                                }
                            }, "*");
                            break;
                        case "WEBCAM_ERROR":
                            ae("Webcam Error"),
                            Q || (document.getElementById("try-on-container").style.display = "none",
                            e.setAttribute("src", ""),
                            Ge());
                            break;
                        case "WEBCAM_STOPPED":
                            document.getElementById("try-on-container").style.display = "none",
                            e.setAttribute("src", "")
                        }
                }
                ,
                e.setAttribute("src", V),
                document.getElementById("try-on-container").style.display = "block",
                Je()
            } else if (Q) {
                const o = Qe();
                te("Mobile Phone Detected, can activate AR: " + o.canActivateAR);
                const a = it();
                if (o.canActivateAR) {
                    if (a && v.BROWSER_CHECK_ACTIVE) {
                        if (y)
                            return oe("iOS and unsupported browser detected"),
                            Xe("browser-not-supported"),
                            void Me("MetaMask");
                        for (let e = 0; e < T.length; e++)
                            if (navigator.userAgent.includes(T[e]))
                                return oe("iOS and unsupported browser detected"),
                                Xe("browser-not-supported"),
                                void Me(T[e])
                    }
                    v.USDZ_CONVERSION_INTEGRATED && a ? async function() {
                        const e = document.getElementById("usdz-loading-modal")
                          , t = setTimeout((()=>{
                            e.style.display = "block",
                            De()
                        }
                        ), 500)
                          , n = await Qe().prepareUSDZ()
                          , o = await (a = n,
                        new Promise(((e,t)=>{
                            dt(a, 3).then((function(e) {
                                const t = new Headers(e.headers);
                                return t.set("content-disposition", 'attachment; filename="model.usdz"'),
                                new Response(e.body,{
                                    headers: t
                                }).blob()
                            }
                            )).then((async t=>{
                                te("Downloaded blob", t),
                                e(URL.createObjectURL(t))
                            }
                            )).catch((function(e) {
                                ae("Error in fetching URL" + e),
                                t(e)
                            }
                            ))
                        }
                        )));
                        var a;
                        e.style.display = "none",
                        clearTimeout(t),
                        ke(),
                        Pe(o)
                    }() : (CONFIGURATION.colorSelector || CONFIGURATION.textureSelector) && a ? (te("iOS Detected and USDZ generation"),
                    function() {
                        const n = document.getElementById("usdz-loading-modal")
                          , o = setTimeout((()=>{
                            n.style.display = "block",
                            De()
                        }
                        ), 500);
                        let a = tt();
                        var i, s, r;
                        Xe("ar-load-ok"),
                        (i = CONFIGURATION.customer,
                        s = CONFIGURATION.project,
                        r = a.id,
                        new Promise(((n,o)=>{
                            const a = i.replace(/\s/g, "_")
                              , c = r.replace(/\s/g, "_")
                              , l = s.replace(/\s/g, "_");
                            let d;
                            d = e || t || "0000";
                            const m = new XMLHttpRequest;
                            m.onreadystatechange = function() {
                                if (4 == m.readyState && 200 == m.status) {
                                    const e = JSON.parse(m.responseText);
                                    ne("USDZ Check data received data", e),
                                    !1 === e.existing ? function(e, t, n, o) {
                                        return new Promise((async(a,i)=>{
                                            const s = Qe()
                                              , r = await s.exportScene()
                                              , c = new XMLHttpRequest
                                              , l = new FormData;
                                            l.append("model", r),
                                            l.append("customer", e),
                                            l.append("user", j),
                                            l.append("project", n),
                                            l.append("model", t),
                                            l.append("variant", o),
                                            c.onreadystatechange = function() {
                                                if (4 == c.readyState && 200 == c.status) {
                                                    const e = JSON.parse(c.responseText);
                                                    ne("USDZ Conversion data received data", e),
                                                    a(e.usdz)
                                                } else
                                                    404 != c.status && 500 != c.status || (ae("Error in USDZ Conversion"),
                                                    i("Error in Server Comm"))
                                            }
                                            ,
                                            te("Trying to send usdz check data"),
                                            ne("Trying to send usdz check data", {
                                                customer: e,
                                                user: j,
                                                project: n,
                                                model: t,
                                                variant: o
                                            });
                                            const d = x + "conversion?customer=" + e + "&user=" + j + "&project=" + n + "&model=" + t + "&variant=" + o;
                                            c.open("POST", d, !0),
                                            c.send(l)
                                        }
                                        ))
                                    }(a, c, l, d).then((e=>{
                                        n(e)
                                    }
                                    )).catch((e=>{
                                        ae("Error in USDZ Upload Download"),
                                        o("Error in USDZ Upload Download")
                                    }
                                    )) : n(e.usdz)
                                } else
                                    404 != m.status && 500 != m.status || (ae("Error in USDZ Conversion Check"),
                                    o("Error in USDZ Conversion Check"))
                            }
                            ,
                            ne("Trying to send usdz check data", {
                                customer: a,
                                user: j,
                                project: l,
                                model: c,
                                variant: d
                            });
                            const u = x + "checkForConversion";
                            m.open("POST", u, !0),
                            m.setRequestHeader("Content-type", "application/json"),
                            m.send(JSON.stringify({
                                customer: a,
                                user: j,
                                project: l,
                                model: c,
                                variant: d
                            }))
                        }
                        ))).then((e=>{
                            n.style.display = "none",
                            clearTimeout(o),
                            ke(),
                            Pe(e)
                        }
                        )).catch((e=>{
                            n.style.display = "none",
                            clearTimeout(o),
                            ae("Error in Usdz Check", e)
                        }
                        ))
                    }()) : (te("iOS or Android click mazingViewer btn"),
                    !a && n ? (Xe("show-autostart-permission"),
                    function() {
                        const e = document.getElementById("permission-modal");
                        document.getElementById("permission-modal-close").onclick = function() {
                            e.style.display = "none"
                        }
                        ,
                        document.getElementById("permission-btn-accept").onclick = function() {
                            xe(),
                            e.style.display = "none"
                        }
                        ,
                        De(),
                        e.style.display = "block"
                    }()) : xe()),
                    Je()
                } else {
                    if (a && v.BROWSER_CHECK_ACTIVE) {
                        if (y)
                            return oe("iOS and unsupported browser detected"),
                            Xe("browser-not-supported"),
                            void Me("MetaMask");
                        for (let e = 0; e < T.length; e++)
                            if (navigator.userAgent.includes(T[e]))
                                return oe("iOS and unsupported browser detected"),
                                Xe("browser-not-supported"),
                                void Me(T[e])
                    }
                    Xe("ar-not-supported"),
                    Se()
                }
            } else
                te("Desktop PC Detected"),
                Ge();
            n && (ne("Count mobile impressions"),
            qe(tt().id, "load_from_autostart"))
        }
    }
    function Me(e) {
        const t = document.getElementById("unsupported-browser-modal")
          , n = document.getElementById("unsupported-browser-modal-close")
          , o = document.getElementById("unsupported-browser-headline");
        o.innerText = o.innerText.replace("{browser}", e),
        n.onclick = function() {
            t.style.display = "none"
        }
        ,
        t.style.display = "block"
    }
    function Ge() {
        te("Generate QR Code");
        const n = document.getElementById("qrcode");
        n.innerHTML = "";
        let i, s = tt();
        qe(s.id, "generate_qr"),
        i = "undefined" == typeof CUSTOMER_NAME ? U + "?pr=" + PROJECT_UID + "&model=" + s.id + "&autoStart=true" : U + "?customer=" + CUSTOMER_NAME + "&project=" + PROJECT_NAME + "&model=" + s.id + "&autoStart=true",
        e && (i = i + "&color=" + e),
        t && (i = i + "&texture=" + t),
        a && (i = i + "&api=" + a),
        o && (i = i + "&otlc=" + o),
        te("QR Url generated"),
        ne("QR Url generated", i),
        new QRCodeStyling({
            width: 250,
            height: 250,
            type: "canvas",
            data: i,
            image: "",
            qrOptions: {
                errorCorrectionLevel: "H"
            },
            dotsOptions: {
                color: "#0a0e4f",
                type: "rounded"
            },
            cornersSquareOptions: {
                type: "square"
            },
            backgroundOptions: {
                color: "transparent"
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 20
            }
        }).append(n);
        const r = document.getElementById("qr-modal");
        document.getElementById("qr-modal-close").onclick = function() {
            r.style.display = "none"
        }
        ,
        De(),
        r.style.display = "block"
    }
    function ke() {
        if (v.LOADING_TIME_MS > 300) {
            const e = document.getElementById("ar-loading-modal");
            if (e) {
                const t = document.getElementById("control-ar-btn");
                t && (t.style.visibility = "hidden"),
                e.style.display = "flex",
                De(!0);
                const n = document.getElementById("ar-loading-modal-close");
                n.style.display = "none",
                v.LOADING_TIME_MS > 15e3 && (n.onclick = function() {
                    Fe()
                }
                ,
                C && clearTimeout(C),
                C = setTimeout((()=>{
                    n && (n.style.display = "block")
                }
                ), 15e3))
            }
            g && (te("arLoadingModalTimeout cleared", g),
            clearTimeout(g)),
            g = setTimeout((()=>{
                Fe()
            }
            ), v.LOADING_TIME_MS)
        }
    }
    function Fe() {
        g && clearTimeout(g);
        const e = document.getElementById("ar-loading-modal");
        e && (e.style.display = "none");
        const t = document.getElementById("control-ar-btn");
        t && (t.style.visibility = "visible")
    }
    function De(e) {
        const t = document.getElementById("autostart-loading-modal");
        if (t && (t.style.display = "none"),
        !e) {
            const e = document.getElementById("control-ar-btn");
            e && (e.style.visibility = "visible")
        }
    }
    function Pe(e) {
        ne("usdzPath", e);
        const t = document.createElement("a");
        t.setAttribute("rel", "ar"),
        t.setAttribute("download", "model.usdz"),
        t.setAttribute("type", "model/vnd.usdz+zip"),
        t.appendChild(document.createElement("img")),
        t.setAttribute("href", e + "#" + Be(!1)),
        document.body.appendChild(t),
        t.addEventListener("message", (e=>{
            "_apple_ar_quicklook_button_tapped" == e.data && Re()
        }
        ), !0),
        t.click()
    }
    function Be(e) {
        let t = "";
        return f.ios && f.ios.length > 0 && (t = f.ios),
        e && I && (t = t ? t + "&" + I : I),
        t
    }
    function He() {
        let e = tt();
        if (ot(!1),
        ne("initialSetColor triggerd"),
        v.COLOR_ANIMATION)
            !async function(e) {
                N = e;
                for (let t = 0; t < e.colorTransition.colors.length; t++) {
                    let n, o = e.colorTransition.colors[t].split(",").map((e=>parseInt(100 * e)));
                    ne("Start at " + t),
                    e.colorTransition.colors[t + 1] ? (n = e.colorTransition.colors[t + 1],
                    ne("End at " + (t + 1))) : (n = e.colorTransition.colors[0],
                    t = -1,
                    ne("End at 0"));
                    const a = n.split(",").map((e=>parseInt(100 * e)));
                    for (; o[0] !== a[0] || o[1] !== a[1] || o[2] !== a[2] || o[3] !== a[3]; ) {
                        if (e !== N)
                            return void ne("Animated Model Changed");
                        o[0] < a[0] ? o[0] += 1 : o[0] > a[0] && (o[0] -= 1),
                        o[1] < a[1] ? o[1] += 1 : o[1] > a[1] && (o[1] -= 1),
                        o[2] < a[2] ? o[2] += 1 : o[2] > a[2] && (o[2] -= 1),
                        o[3] < a[3] ? o[3] += 1 : o[3] > a[3] && (o[3] -= 1),
                        We(e.colorTransition.material, [o[0] / 100, o[1] / 100, o[2] / 100, o[3] / 100], !1),
                        await st(e.colorTransition.timeout)
                    }
                }
            }(e);
        else if (CONFIGURATION.colorSelector)
            Ve(!1, e.colors[0], e.materialIndex, 0);
        else if (CONFIGURATION.textureSelector)
            nt(!1, e, 0);
        else if (CONFIGURATION.noMaterialModification)
            ne("No material modification wished");
        else {
            let t = e.colors && e.colors[0] ? e.colors[0] : void 0
              , n = t && t.METALLIC ? t.METALLIC : e.modelMetallic ? e.modelMetallic : v.METALLIC
              , o = t && t.ROUGHNESS ? t.ROUGHNESS : e.modelRoughness ? e.modelRoughness : v.ROUGHNESS
              , a = t && t.EXPOSURE ? t.EXPOSURE : e.modelExposure ? e.modelExposure : v.EXPOSURE;
            ne("initialSetColor", {
                metallicFactor: n,
                roughnessFactor: o,
                exposure: a
            }),
            e.skipViewerModification ? (ne("Skipviewer modification, use basis glb instead"),
            e.forceConfigurationExposure && ze(a)) : (je(n, o),
            ze(a))
        }
    }
    function Ve(t, n, o, a) {
        for (let e = 0; e < X.length; e++)
            X[e].classList.remove("active"),
            X[e].value === a && X[e].classList.add("active");
        let i = tt()
          , s = n.COLOR ? n.COLOR : n
          , r = n.METALLIC ? n.METALLIC : i.modelMetallic ? i.modelMetallic : v.METALLIC
          , c = n.ROUGHNESS ? n.ROUGHNESS : i.modelRoughness ? i.modelRoughness : v.ROUGHNESS
          , l = n.EXPOSURE ? n.EXPOSURE : i.modelExposure ? i.modelExposure : v.EXPOSURE;
        const d = s.split(",").map((e=>parseFloat(e)));
        ne("change color triggered", {
            color: d,
            metallicFactor: r,
            roughnessFactor: c,
            exposure: l
        }),
        i.skipViewerModification ? i.forceConfigurationExposure && ze(l) : (je(r, c),
        ze(l)),
        We(o, d),
        e = a,
        v.INTEGRATION_ACTIVE && ye("SWITCH_COLOR"),
        t && qe(i.id, "change_color", "idx-" + e)
    }
    function je(e, t) {
        ne("setMaterialMetallicRoughnessExposure", {
            metallicFactor: e,
            roughnessFactor: t
        });
        const n = Qe().model.materials;
        for (let o = 0; o < n.length; o++)
            n[o].pbrMetallicRoughness.setMetallicFactor(e),
            n[o].pbrMetallicRoughness.setRoughnessFactor(t)
    }
    function ze(e) {
        Qe().exposure = e
    }
    function We(e, t, n=!0) {
        n && ne("setMaterialColor", {
            materialIndex: e,
            color: t
        }),
        Qe().model.materials[e].pbrMetallicRoughness.setBaseColorFactor(t)
    }
    function qe(e, t, n="none") {
        if (!v.DISABLE_IMPRESSION_TRACKING) {
            const o = e.replace(/\s/g, "_")
              , a = t.replace(/\s/g, "_")
              , i = n.replace(/\s/g, "_")
              , s = new XMLHttpRequest;
            s.onreadystatechange = function() {
                4 == s.readyState && 200 == s.status && te("Analytics data successfully sent.")
            }
            ;
            const r = k + "?projectUID=" + PROJECT_UID + "&model=" + o + "&action=" + a + "&user=" + j + "&additionalData=" + i;
            te("Trying to send analytics data"),
            ne("Trying to send analytics data", {
                model: o,
                action: a,
                additionalData: i
            }),
            s.open("GET", r, !0),
            s.send(null)
        }
    }
    function Xe(e, t=!0) {
        if (!v.DISABLE_IMPRESSION_TRACKING) {
            const n = tt().id.replace(/\s/g, "_")
              , o = e.replace(/\s/g, "_")
              , a = encodeURIComponent(navigator.userAgent)
              , i = _e() ? "1" : "0"
              , s = F + "?projectUID=" + PROJECT_UID + "&model=" + n + "&status=" + o + "&user=" + j + "&userAgent=" + a + "&isIframe=" + i;
            if (!t)
                return encodeURIComponent(Base64.encode(s));
            {
                const e = new XMLHttpRequest;
                e.onreadystatechange = function() {
                    4 == e.readyState && 200 == e.status && te("Maintenance data successfully sent.")
                }
                ,
                te("Trying to send maintenance data"),
                te("Trying to send maintenance data (isIframe)", i),
                ne("Trying to send maintenance data", {
                    model: n,
                    status: o,
                    userAgent: a,
                    iframeVal: i
                }),
                e.open("GET", s, !0),
                e.send(null)
            }
        }
    }
    function Je() {
        ne("Count mobile impressions"),
        qe(tt().id, "view_model_ar")
    }
    function Ye(e) {
        if ("user-interaction" === e.detail.source) {
            const t = e.target.getCameraOrbit()
              , n = (new Date).getTime()
              , o = W[W.length - 1]?.time;
            if (!o || Math.abs(n - o) >= 1e3) {
                const e = {
                    time: (new Date).getTime(),
                    theta: t.theta,
                    phi: t.phi,
                    radius: t.radius,
                    model: b.id
                };
                W.push(e),
                ne("[EXPERIENCE] added entry: ", e)
            }
        }
    }
    function $e(e) {
        let t = ct(e.callToAction.title)
          , n = ct(e.callToAction.subtitle)
          , o = ct(e.callToAction.button);
        if (!v.HIDE_CALL_TO_ACTION_3D) {
            document.getElementById("call-to-action-headline").innerText = o;
            const t = document.getElementById("call-to-action-link");
            t && (t.href = e.callToAction.callback);
            const a = document.getElementById("call-to-action-button-subtitle");
            a && (a.innerText = n)
        }
        if (!v.HIDE_CALL_TO_ACTION_AR) {
            const a = document.getElementById("web-ar-product-link");
            a && (a.href = e.callToAction.callback),
            document.getElementById("web-ar-product-title").innerText = t,
            document.getElementById("web-ar-product-subtitle").innerText = n,
            document.getElementById("web-ar-product-button").innerText = o,
            n = encodeURIComponent(n),
            o = encodeURIComponent(o),
            CONFIGURATION.encryption ? f.android = "#?123&title=" + t + "&link=" + e.callToAction.callback : f.android = "&title=" + t + "&link=" + e.callToAction.callback + "&" + SESSION.substring(1),
            t = encodeURIComponent(t),
            f.ios = "callToAction=" + o + "&checkoutTitle=" + t + "&checkoutSubtitle=" + n
        }
    }
    function Ze(e, t, n, o) {
        ne("Adding new hotspot", e);
        const a = document.createElement("button");
        let i;
        a.classList.add("general-hotspot"),
        a.classList.add("hotspot-dot");
        const s = o.autoRotate
          , r = Number(t) + 1;
        if ("text" === e.type) {
            a.slot = "hotspot-" + r,
            a.id = "hotspot-" + r,
            i = document.createElement("div"),
            i.classList.add("hotspot-text-container");
            const t = document.createElement("div");
            t.id = "headline-hotspot-" + r,
            t.classList.add("hotspot-text-headline"),
            t.innerHTML = ct(e.data.headline),
            i.appendChild(t);
            const n = document.createElement("div");
            n.id = "subline-hotspot-" + r,
            n.classList.add("hotspot-text-subline"),
            n.innerHTML = ct(e.data.subline),
            i.appendChild(n)
        } else if ("camera_view" === e.type) {
            if (R.lastClickedHotspot === e.data.button.option.meta)
                return;
            if (!R.lastClickedHotspot && !e.data.button.option.start_point)
                return;
            a.slot = "hotspot-" + r,
            a.id = "hotspot-" + r,
            i = document.createElement("div"),
            i.classList.add("hotspot-text-container");
            const t = document.createElement("div");
            t.id = "headline-hotspot-" + r,
            t.classList.add("hotspot-text-headline"),
            t.innerHTML = ct(e.data.headline),
            i.appendChild(t);
            const n = document.createElement("button");
            n.id = "navigate-button-hotspot-" + r;
            const o = ["helvetica", "hotspot-camera-view-btn", "noselect"];
            n.classList.add(...o),
            n.onclick = ()=>{
                ne("Hotspot navigate Button clicked", e),
                "camera-view" === e.data.button.option.type && "navigate" === e.data.button.option.action && (R.interactedWithCameraView = !0,
                function(e, t) {
                    te("navigateToCameraView", e);
                    const n = Qe();
                    if ("root" === e)
                        n.minCameraOrbit = w.minCameraOrbit,
                        n.cameraTarget = w.cameraTarget,
                        n.cameraOrbit = w.cameraOrbit,
                        n.autoRotate = t,
                        n.interactionPrompt = "auto";
                    else {
                        n.minCameraOrbit = "auto auto 0m",
                        n.autoRotate = !1,
                        n.interactionPrompt = "none";
                        for (let t = 0; t < b.cameraViews.length; t++)
                            if (b.cameraViews[t].id === e) {
                                n.cameraTarget = b.cameraViews[t].cameraTarget,
                                n.cameraOrbit = b.cameraViews[t].cameraOrbit;
                                break
                            }
                    }
                    Oe(b)
                }(e.data.button.option.meta, s))
            }
            ,
            n.innerText = ct(e.data.button),
            i.appendChild(n)
        }
        a.appendChild(i),
        e.visible ? (qe(n.id, "hotspot_forced_view", e.id),
        a.addEventListener("click", (e=>{
            a.focus()
        }
        ), !0)) : (i.style.display = "none",
        a.addEventListener("click", (t=>{
            if (R.interactedWithCameraView = !1,
            i.style.display = "block",
            qe(n.id, "hotspot_open_click", e.id),
            a.focus(),
            o.autoRotate = !1,
            o.interactionPrompt = "none",
            "camera_view" === e.type && (R.lastClickedHotspot = e.data.button.option.meta),
            CONFIGURATION.hideInactiveHotspots && "text" === e.type)
                for (let e = 0; e < S.length; e++)
                    S[e].id !== a.id && (S[e].style.visibility = "hidden")
        }
        ), !0),
        "text" === e.type ? a.addEventListener("blur", (e=>{
            if (i.style.display = "none",
            o.autoRotate = s,
            o.interactionPrompt = "auto",
            CONFIGURATION.hideInactiveHotspots)
                for (let e = 0; e < S.length; e++)
                    S[e].id !== a.id && (S[e].style.visibility = "visible")
        }
        ), !0) : "camera_view" === e.type && a.addEventListener("blur", (e=>{
            setTimeout((()=>{
                "root" === R.lastClickedHotspot || R.interactedWithCameraView || (o.autoRotate = s,
                o.interactionPrompt = "auto"),
                i.style.display = "none"
            }
            ), 400)
        }
        ), !0)),
        a.setAttribute("data-position", e.position),
        a.setAttribute("data-normal", e.normal),
        a.setAttribute("data-visibility-attribute", "visible"),
        S.push(a),
        o.appendChild(a)
    }
    function Ke(e) {
        ne("Call To Action Triggered from (ar)", e);
        let t = tt();
        t && qe(t.id, e ? "call_to_action_ar" : "call_to_action_3d")
    }
    function Qe() {
        return document.querySelector("mazing-viewer")
    }
    function et() {
        return new Promise((async e=>{
            let t = Qe();
            for (; !t || !t.model || !t.model.materials; )
                await st(200),
                t = Qe(),
                t.model && t.model.materials;
            e()
        }
        ))
    }
    function tt() {
        if (!CONFIGURATION.productSelector)
            return ne("Get Current Product from base[0]"),
            n = 0,
            BASE_MODELS[0];
        {
            const e = document.getElementById("productSelector");
            if (!e)
                return n = 0,
                BASE_MODELS[0];
            const t = e.value;
            ne("Get Current Product from selector", t);
            for (let e = 0; e < BASE_MODELS.length; e++)
                if (BASE_MODELS[e].id === t)
                    return n = e,
                    BASE_MODELS[e]
        }
    }
    function nt(e, n, o, a=!1) {
        "normal" === v.TEXTURE_SELECTOR_TYPE ? async function(e, n, o, a, i, s) {
            const r = Qe();
            for (let e = 0; e < J.length; e++)
                if (J[e].classList.remove("active"),
                J[e].id === n.id) {
                    J[e].classList.add("active"),
                    t = e;
                    const o = document.getElementById("texture-name");
                    "dynamic" === v.TEXTURE_NAMING ? n.name ? o.innerText = ct(n.name) : o.innerText = n.id : "static" === v.TEXTURE_NAMING && (o.innerText = ct(Z.selectTexture))
                }
            v.INTEGRATION_ACTIVE && !s && ye("SWITCH_TEXTURE");
            const c = await r.createTexture(n.value.includes("blob:") ? n.value : l + n.value);
            let d = r.model.materials[a];
            "pbr" === i ? d.pbrMetallicRoughness[o].setTexture(c) : d[o].setTexture(c);
            let m = tt();
            e && qe(m.id, "change_texture", "idx-" + t)
        }(e, n.textures[o], n.textureChannel, n.textureMaterialIndex, n.textureType, a) : "multi" === v.TEXTURE_SELECTOR_TYPE && async function(e, n, o) {
            for (; $; )
                await st(100);
            $ = !0,
            await et();
            try {
                const a = Qe();
                for (let e = 0; e < J.length; e++)
                    if (J[e].classList.remove("active"),
                    J[e].id === n.id) {
                        J[e].classList.add("active"),
                        t = e;
                        const o = document.getElementById("texture-name");
                        "dynamic" === v.TEXTURE_NAMING ? n.name ? o.innerText = ct(n.name) : o.innerText = n.id : "static" === v.TEXTURE_NAMING && (o.innerText = ct(Z.selectTexture))
                    }
                v.INTEGRATION_ACTIVE && !o && ye("SWITCH_TEXTURE"),
                ne("Apply Texture Operations(count): ", n.operations.length);
                for (let e = 0; e < n.operations.length; e++) {
                    const t = n.operations[e];
                    ne("Apply Texture Operation", t);
                    const o = t.value.includes("blob:") ? t.value : l + t.value
                      , i = await a.createTexture(o);
                    "pbr" === t.textureType ? (ne("DEBUG (texture)", i),
                    a.model.materials[t.textureMaterialIndex].pbrMetallicRoughness[t.textureChannel].setTexture(i)) : (ne("DEBUG (currentOp.textureMaterialIndex", t.textureMaterialIndex),
                    ne("DEBUG (currentOp.textureMaterialIndex", a.model.materials[t.textureMaterialIndex]),
                    ne("DEBUG (currentOp.textureType", t.textureType),
                    ne("DEBUG (currentOp.textureType", a.model.materials[t.textureMaterialIndex][t.textureType]),
                    a.model.materials[t.textureMaterialIndex][t.textureType].setTexture(i)),
                    await st(100)
                }
                let i = tt();
                e && qe(i.id, "change_texture", "idx-" + t)
            } finally {
                $ = !1
            }
        }(e, n.textures[o], a)
    }
    function ot(e) {
        e ? (at(!1),
        A = (new Date).getTime(),
        ne("Loading start time", A)) : (at(!0),
        A && (v.LOADING_TIME_MS = (new Date).getTime() - A,
        ne("baseValues.LOADING_TIME_MS", v.LOADING_TIME_MS)));
        const t = document.getElementById("loading-modal");
        t.style.display = e ? "block" : "none"
    }
    function at(e) {
        const t = ["control-ar-btn", "texture-selector-container", "product-selector-container", "color-selector-container", "product-selector-images-container", "cta-btn"];
        for (let n = 0; n < t.length; n++) {
            const o = document.getElementById(t[n]);
            o && (o.style.opacity = e ? 1 : .5)
        }
        const n = document.getElementById("control-ar-btn");
        n && (n.style.animationPlayState = e ? "running" : "paused")
    }
    function it() {
        return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod", "Mac68K", "MacPPC", "MacIntel", "Macintosh"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend"in document
    }
    function st(e) {
        return new Promise((t=>setTimeout(t, e)))
    }
    function rt() {
        let e = navigator.languages ? navigator.languages[0] : navigator.language;
        return e ? (ne("[LANG] selected language", e),
        e.substr(0, 2)) : (oe("Fallback to english because navigator has no language data."),
        "en")
    }
    function ct(e) {
        return e[h] ? e[h] : e.en
    }
    function lt(e) {
        return (e.COLOR ? e.COLOR : e).split(",").map((e=>255 * parseFloat(e)))
    }
    function dt(e, t) {
        return ne("Fetch Url", e),
        te("Fetch tries left ", {
            n: t
        }),
        fetch(e).catch((function(n) {
            if (1 === t)
                throw n;
            return dt(e, t - 1)
        }
        ))
    }
    function mt(e) {
        return e + SESSION
    }
    window.onload = ie,
    globalThis.currentMazingViewer = Qe,
    globalThis.resetAll = function() {
        document.getElementById("bodyId").innerHTML = "",
        ie()
    }
    ,
    globalThis.checkIfModelLoaded = et,
    globalThis.getAllMeshesOfModel = function() {
        return new Promise((async e=>{
            const t = ge(Qe());
            let n = [];
            t.traverse((e=>{
                e.isMesh && n.push({
                    name: e.name
                })
            }
            )),
            e(n)
        }
        ))
    }
    ,
    globalThis.getAllMaterialsOfModel = Ce,
    globalThis.activateThreeJS = ue,
    globalThis.modifyHotspot = function(e, t) {
        const n = Number(t) + 1;
        ne("Modify hotspot", {
            hotspot: e,
            id: n
        });
        const o = document.getElementById("hotspot-" + n);
        if (ne("hotSpotEl found", o),
        o) {
            if ("text" === e.type) {
                const t = document.getElementById("headline-hotspot-" + n)
                  , o = document.getElementById("subline-hotspot-" + n);
                t && o && (t.innerText = ct(e.data.headline),
                o.innerText = ct(e.data.subline))
            }
            e.position && e.normal && (o.setAttribute("data-position", e.position),
            o.setAttribute("data-normal", e.normal))
        }
    }
    ,
    globalThis.removeHotspot = function(e) {
        const t = Number(e) + 1;
        ne("Remove hotspot", {
            id: t
        });
        const n = document.getElementById("hotspot-" + t);
        ne("hotSpotEl found", n),
        n && n.remove()
    }
    ,
    globalThis.addHotspot = Ze,
    globalThis.showARBtn = function(e) {
        document.getElementById("control-ar-btn").style.display = e ? "flex" : "none"
    }
    ,
    globalThis.updateDimensions = fe,
    globalThis.getCurrentProduct = tt,
    globalThis.setEditorActive = function() {
        v.EDITOR_ACTIVE = !0
    }
    ,
    globalThis.LANG_RES = Z
}
,
"function" == typeof define && define.amd ? define(["object.values/auto"], e) : e();
