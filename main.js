      // load the Portal and PortalQueryParams modules
      require(["esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/portal/Portal",
      "esri/layers/FeatureLayer",
      "esri/layers/WFSLayer",
      "esri/core/promiseUtils",
      "esri/layers/WMSLayer",
      "esri/layers/MapImageLayer",
      "esri/widgets/Editor",
      "esri/widgets/Expand",
      "esri/widgets/Legend",
      "esri/Basemap",
      "esri/layers/WebTileLayer",
      "esri/widgets/BasemapGallery",
      "esri/core/watchUtils",
      "esri/core/reactiveUtils",
      "esri/geometry/projection",
      "esri/geometry/SpatialReference",
      "esri/widgets/LayerList",
      "esri/portal/PortalItem",
      "esri/geometry/Extent",
      "esri/layers/GraphicsLayer",
      "esri/layers/Layer",
      "esri/Graphic",
      "esri/geometry/support/GeographicTransformationStep",
      "esri/geometry/support/GeographicTransformation",
      "esri/geometry/Polyline",
      "esri/geometry/support/webMercatorUtils",
      "dojo/on",
      "esri/widgets/FeatureTable/Grid/support/ButtonMenu",
      "dojo/domReady!"], function(esriConfig,Map,MapView,Portal,FeatureLayer,WFSLayer,promiseUtils,WMSLayer,
        MapImageLayer,Editor,Expand,Legend,Basemap,WebTileLayer,BasemapGallery,watchUtils,reactiveUtils,projection,SpatialReference,
        LayerList,PortalItem,Extent,GraphicsLayer,Layer,Graphic,GeographicTransformationStep,GeographicTransformation,Polyline,
        webMercatorUtils,on,ButtonMenu) {
    
    // Acount devloper key esri
    esriConfig.apiKey = "AAPK7750c0fba3b54fcd8d7b0e89c1fb9a20fnE41U2ccxHMJw_pJKEXhv1DRV_RMD8DDnGZAyLabuGivGfblyXTyvp23Pax-XNd";



    // Set up url portal VA
    portalA = new Portal("https://portailsigdev.vinci-autoroutes.com/arcgis");
    // Setting authMode to immediate signs the user in once loaded
    const con = portalA.authMode = "immediate";
    console.log(portalA)

//****************************************************************************************************************************************
//                               Once portal is loaded, user signed in and load the application (code above)
//****************************************************************************************************************************************

    portalA.load().then(function() {
        console.log(portalA);
        // Set visible the html custom widget
        document.getElementById("infoDiv").style.visibility = "visible";
        
    // Get the info from user
    var div = document.getElementById('usercon');
    div.innerHTML += portalA.user.username;
    
    // Load mapimagerlayer PR from portal
    let road_pr = new MapImageLayer({
      portalItem:{
      id: "de15d213a0034d6489fca3ecef9890bb",
      portal: portalA},
      sublayers: [
        {id:0,title:'PR',legendEnabled:false},
      ]
    });

    // Load mapimagerlayer highway Cofiroute from portal
    let road_COF = new MapImageLayer({
      portalItem:{
      id: "e994df4a4350472db44afeec1c52a77a",
      portal: portalA,
      },
      sublayers: [
        {id:11,popupEnable:false,title:"Autres réseaux "},
        {id:10,popupEnable:false,title:"Autres réseaux VA"},
        {id:8,popupEnable:false,title:"Vinci Autoroutes Alsace",
        sublayers:[{id:9,popupEnable:false,title:"District Ittenheim"}]},
        {id:4,popupEnable:false,title:"Région Centre Val de Loire",
        sublayers:[{id:5,popupEnable:false,title:"District Loiret"},
                   {id:6,popupEnable:false,title:"District Touraine-Poitou"},
                   {id:7,popupEnable:false,title:"District Sologne"}]},
        {id:0,popupEnable:false,title:"Région OUEST",
          sublayers:[{id:1,popupEnable:false,title:"District Ile-de-France"},
                     {id:2,popupEnable:false,title:"District Maine"},
                     {id:3,popupEnable:false,title:"District Anjou-Atlantique"}]},
      ],

    });

    // Function to get automatically the title of the feature on the popup
    function setTitle(feature){
      txt =feature.graphic.layer.title
      let node =`<b>${txt}</b>`
      return node;
    };

    
    const editThisAction = {
      title: "Mettre à jour",
      id: "edit-this",
      className: "esri-icon-edit"
    };

    // Setup popup options for a specific layer
    const template_CE = {
      title: setTitle,
      actions: [editThisAction],
      content: [{
        "type": "fields",
          "fieldInfos": [
            {
              "fieldName": "AUTOROUTE",
              "label": "Autoroute",
              "isEditable": false,
              "tooltip": "",
              "visible": true,
              "format": null,
              "stringFieldOption": "text-box"
            },
            {
              "fieldName": "PR_CENTRE",
              "label": "PR",
              "isEditable": false,
              "tooltip": "",
              "visible": true,
              "format": null,
              "stringFieldOption": "text-box"
            },
             {
                "fieldName": "SCA",
                "label": "SCA",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "DRE",
                "label": "Direction régionale",
                "isEditable": true,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "DISTRICT",
                "label": "District",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "CENTRE_ENTRETIEN",
                "label": "Centre d'entretien",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              { 
                type: "field",
                fieldName: "NOM_DIFFUSEUR",
                label: "Nom du diffuseur associé"
              },
              { 
                type: "field",
                fieldName: "PR_DIFFUSEUR",
                label: "PR du diffuseur associé"
              },
              { 
                type: "field",
                fieldName: "LIEN_GOOGLE",
                label: "Google Street View"
              }, 
            ],
            }]
          };
    
    // Load mapimagerlayer CE with from portal :
    // - popup
    // - editing
    let ft_CE = new FeatureLayer({
      portalItem: {
      id: "7f651332e6f245688ab1b82abcd0f0de",
      portal: portalA, // This loads the first portal instance set above
      },
      layerId: 2,
      title:"Centre d'entretien",
      popupTemplate: template_CE,
      legendEnabled:false,
    });

    // Load mapimagerlayer DI with from portal :
    // - popup
    // - editing
    let ft_DI = new FeatureLayer({
      portalItem: {
      id: "7f651332e6f245688ab1b82abcd0f0de",
      portal: portalA, // This loads the first portal instance set above
      },
      layerId: 1,
      title:"Districts",
      popupTemplate: template_CE,
      legendEnabled:false,
      visible:false,
    });

    // Load mapimagerlayer DR with from portal :
    // - popup
    // - editing
    let ft_DR = new FeatureLayer({
      portalItem: {
      id: "7f651332e6f245688ab1b82abcd0f0de",
      portal: portalA, // This loads the first portal instance set above
      },
      layerId: 0,
      title:"Direction Régionale",
      popupTemplate: template_CE,
      legendEnabled:false,
      visible:false
    });

    // Creat the map
    const map = new Map({
      basemap: "arcgis-dark-gray" //"arcgis-topographic"
      });

    // Creat the mapview
    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [3.2773833,48.0375061],
        zoom: 7,
        constraints: {
          rotationEnabled: false
        }
    });

    // Creat and load the graphicslayer which will contain the creations of the custom widget
    const graphicsLayer = new GraphicsLayer();
    graphicsLayer.listMode="hide"
    graphicsLayer.title="PR widget"
    map.add(graphicsLayer);

    // Creat de legend with expand API
    const legend = new Expand({
      view,
      content: new Legend({
        view: view,
        layerInfos: [
          {layer: road_COF,title:'Autoroutes VA'}] 
        }),
        expandIconClass: "esri-icon-legend"
    });
    view.ui.add(legend, "bottom-right")

    // Creat de basemapgallery with expand API
    var basemapGallery=new BasemapGallery({view:view })
    const bgExpand2 = new Expand({
      view,
      content:basemapGallery,
      expandIconClass: "esri-icon-basemap"
    });
    view.ui.add(bgExpand2, "top-right")

    // Load all the layers from portal in the map
    let Layers_add = [road_COF,road_pr,ft_DR,ft_DI,ft_CE]
    Layers_add.forEach(function (layer) {
      map.add(layer);
    });

    // ------------------------------------ Setup dynamic load WFS ------------------------------------
    // Function to retrieve bbox in WGS84 ymin,xmin,ymax,xmax
    function xy (extent){
      var sr4326 = new SpatialReference({
        wkid: 4326
    });
      var LatLongExtent = projection.project(extent, sr4326);
        let ymax =LatLongExtent.ymax.toFixed(3)
        let xmax=LatLongExtent.xmax.toFixed(3)
        let ymin=LatLongExtent.ymin.toFixed(3)
        let xmin=LatLongExtent.xmin.toFixed(3)
        let lis_temp=[ymin,xmin,ymax,xmax]
        let new_bbox = String(lis_temp.join())
        return new_bbox
      }

    // Setup popup for the WFS layer
    const template_wfs = {
      // autocasts as new PopupTemplate()
      title: setTitle,
      content: [{
        "type": "fields",
          "fieldInfos": [
              {
                "fieldName": "numero",
                "label": "Numero",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "section",
                "label": "Section",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "nom_com",
                "label": "Commune",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "code_insee",
                "label": "INSEE",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
            ]
          }]
        }
      
      // url WFS called
      const url_parc ="https://wxs.ign.fr/parcellaire/geoportail/wfs"

      // Setup the WFS layer parameter
      const layer_wfs = new WFSLayer({
      url:url_parc,
      title: "Parcellaire express (cadastre)",
      name:"parcelle",
      namespaceUri:"https://wxs.ign.fr/datastore/CADASTRALPARCELS.PARCELLAIRE_EXPRESS",
      minScale:5000,
      customParameters: {
      count:2000,
      BBOX:"47.883,1.958,47.883,1.958"
      // COUNT:"1000"
      },
      outFields: ["*"],// Retrieve all fields
      popupTemplate:template_wfs
      });

      // Add the WFS to the map
      map.add(layer_wfs)

      // Request de WFS stream every time the mapzoom is in list arr
      const arr=[22,21,20,19,18,17,16]
            reactiveUtils.when(
                () => arr.includes(view?.zoom) ,
                async () => {console.log(view.zoom)
                  layer_wfs.load().then(() => {
                    const updateBBOX = promiseUtils.debounce(() => {
                      return new Promise((resolve) => {
                        layer_wfs.customParameters.BBOX=xy(view.extent)
                        layer_wfs.refresh();
                        layer_wfs.once("refresh", resolve);
                      });
                    });
                // Catch the request in the map once the map is stationary
                view.watch("stationary", (stationary) => {
                  if (stationary) {
                    updateBBOX().catch();
                  }
                });
        updateBBOX().catch();
      })
    });
    // --------------------------------------------------------------------------------------------
  
    // Creat the widget layerlist with expand to control the display of layers
    const bgExpand3 = new Expand({
      content:new LayerList({
      view: view,
      // executes for each ListItem in the LayerList
      selectionEnabled:true,
      })
    });
    view.ui.add(bgExpand3, "top-right");

    const editor = new Editor({
      view: view,
    layerInfos: [{
    layer: ft_DR, // pass in the feature layer,
    formTemplate:  { // autocastable to FormTemplate
      elements: [
        { // autocastable to FieldElement
          type: "field",
          fieldName: "SCA",
          label: "SCA"
        },
        {
          type: "field",
          fieldName: "DRE",
          label: "Direction régionale"
        },   
      ]
    },
    allowAttachments:false,
    enabled: true, // default is true, set to false to disable editing functionality
    addEnabled: true, // default is true, set to false to disable the ability to add a new feature
    updateEnabled: true, // default is true, set to false to disable the ability to edit an existing feature
    deleteEnabled: true // default is true, set to false to disable the ability to delete features
  },
  { 
    layer: ft_DI, // pass in the feature layer,
    formTemplate:  { // autocastable to FormTemplate
      elements: [
        { 
          type: "field",
          fieldName: "SCA",
          label: "SCA"
        },
        { 
          type: "field",
          fieldName: "DRE",
          label: "Direction régionale"
        },
        { 
          type: "field",
          fieldName: "DISTRICT",
          label: "District"
        },           
      ]
    },
    allowAttachments:false,
    enabled: true, // default is true, set to false to disable editing functionality
    addEnabled: true, // default is true, set to false to disable the ability to add a new feature
    updateEnabled: true, // default is true, set to false to disable the ability to edit an existing feature
    deleteEnabled: true // default is true, set to false to disable the ability to delete features
  },
  { 
    layer: ft_CE, // pass in the feature layer,
    formTemplate:  { // autocastable to FormTemplate
      elements: [
        { 
          type: "field",
          fieldName: "SCA",
          label: "SCA"
        },
        { 
          type: "field",
          fieldName: "DRE",
          label: "Direction régionale"
        },
        { 
          type: "field",
          fieldName: "DISTRICT",
          label: "District"
        },
        { 
          type: "field",
          fieldName: "CENTRE_ENTRETIEN",
          label: "Centre d'entretien"
        },
        { 
          type: "field",
          fieldName: "NOM_DIFFUSEUR",
          label: "Nom du diffuseur associé"
        },
        { 
          type: "field",
          fieldName: "PR_DIFFUSEUR",
          label: "PR du diffuseur associé"
        },                   
      ],
    },
    allowAttachments:false,
    enabled: true, // default is true, set to false to disable editing functionality
    addEnabled: true, // default is true, set to false to disable the ability to add a new feature
    updateEnabled: true, // default is true, set to false to disable the ability to edit an existing feature
    deleteEnabled: true // default is true, set to false to disable the ability to delete features
  },
  ]     
  })
    
    // Creat the widget Editor with expand
    const bgExpand4 = new Expand({
      view,
      content: editor,
    expandIconClass: "esri-icon-edit"
    });
    // Add widget to the view
    view.ui.add(bgExpand4, "bottom-left");



    function editThis() {
      // If the EditorViewModel's activeWorkflow is null, make the popup not visible
      if (!editor.viewModel.activeWorkFlow) {
        view.popup.visible = false;
        // Call the Editor update feature edit workflow

        editor.startUpdateWorkflowAtFeatureEdit(
          view.popup.selectedFeature
        );
        // view.ui.add(editor, "top-right");
        bgExpand4.expanded =true;
        view.popup.spinnerEnabled = false;
      }};

      ft_CE.on("apply-edits", () => {
        // Once edits are applied to the layer, remove the Editor from the UI
        // view.ui.remove(editor);
        // features = view.popup.features
        // Iterate through the features

        // features.forEach((feature) => {
        //   // Reset the template for the feature if it was edited
        //   feature.popupTemplate = template_CE;
        // });

        // Open the popup again and reset its content after updates were made on the feature
        // if (features) {
        //   view.popup.open({
        //     popupTemplate:template_CE,
        //     // fetchFeatures:true,
        //     features: features
        //   });
        // }

        // Cancel the workflow so that once edits are applied, a new popup can be displayed
        editor.viewModel.cancelWorkflow();
        bgExpand4.expanded =false;
      });

      ft_DI.on("apply-edits", () => {
        editor.viewModel.cancelWorkflow();
        bgExpand4.expanded =false;
      });

      ft_DR.on("apply-edits", () => {
        editor.viewModel.cancelWorkflow();
        bgExpand4.expanded =false;
      });


    // Event handler that fires each time an action is clicked
    view.popup.on("trigger-action", (event) => {
      if (event.action.id === "edit-this") {
        editThis();
      }
    });

    // ----------------------------------- Interactions with the custm widget ---------------------------------------
    // Variable to interact with the custom widget and html code
    const PrClic = document.getElementById("PR clic"); // Tool PR au clic
    const SupPR = document.getElementById("SupPR"); // Tool delete PR au clic in the map
    const SearchPR = document.getElementById("SearchPR"); // Tool search PR (custom request API qith parameter)
    const SupSearch = document.getElementById("SupSearch"); // Tool delete search PR in the map

    // Display and remove text when the user use tab widget
    function removeAllText(element) {
      // loop through all the nodes of the element
      var nodes = element.childNodes;
      for(var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          // if it's a text node, remove it
          if(node.nodeType == Node.TEXT_NODE) {
              node.parentNode.removeChild(node);
              i--; // have to update our incrementor since we just removed a node from childNodes
          } else
          // if it's an element, repeat this process
          if(node.nodeType == Node.ELEMENT_NODE) {
              removeAllText(node);
          }
      }
    }

    // Creat the custom widget with expand
    const expand = new Expand({
      expandIconClass: "esri-icon-map-pin",
      expandTooltip: "Expand Lorem Ipsum",
      collapseTooltip: "Collapse Lorem Ipsum",
      view: view,
      content: document.getElementById("infoDiv")
    });
    view.ui.add(expand, "top-left");

    // When the custom widget is closed : remove the layers created with the widget
    watchUtils.pausable(expand , "expanded", function(){
    const staut_ex =expand.expanded 
    if(staut_ex==false){
      graphicsLayer.removeAll();
      graphicsLayer.listMode="hide";
      view.popup.close()
    }
      });
    
    // When the widget Search PR is used : remove the previous research in the map
    SupSearch.addEventListener("click",() => {
      graphicsLayer.removeAll();
      graphicsLayer.listMode="hide";
      view.popup.close()
    })

    // Trigger when tool search PR is used
    SearchPR.addEventListener("click",() => {
      graphicsLayer.removeAll()
      // Url from the custom API on intern arcgis sever
      const url_s = "https://arcgisserverdev.vinci-autoroutes.com/arcgis/rest/services/Referentiel/ReferentielGeocodeurV2/MapServer/exts/Geocodeur/APS2Geom"

      // retrieve all attributes setup by the user in the widget
      let aut_value = document.getElementById("InAutoroute").value
      let pr_value = document.getElementById("InPR").value
      let sens_value = document.getElementById("InSens").value
      let deport_value = document.getElementById("InDeport").value

      // Creat the JSON object with the attrobutes user to send
      const obj_search = [
        {
        "APS": [
        {
        "Identifiant": aut_value,
        "TypeSegment": "SectionCourante",
        "PR": pr_value.replace(',', '.'),
        "Sens": sens_value,
        "Deport": deport_value
        }	]	}
        ];
      
      // Setup request http to the API
      var xhr = new XMLHttpRequest();
      var url = url_s+"?APSEtOption=" + encodeURIComponent(JSON.stringify(obj_search))+"&f=json";
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        // If the request works
        if (xhr.readyState === 4 && xhr.status === 200) {
          removeAllText(document.getElementById("run2"));
          console.log("Requete ok!")
          let resp = xhr.response
          let res_tmp1 =JSON.parse(resp)
          let res_tmp2=res_tmp1 ["Resultat"] // JSON element with the result
          console.log(res_tmp2)// check result in console
          try {
            let res = res_tmp2[0]// JSON element with the result (the result is a list)

            // coordinates of the projected point
            let x_proj = res["APS"]["PointProjete"]["x"]
            let y_proj = res["APS"]["PointProjete"]["y"]

            // coordinates of the initial point
            let x_ini = res["APS"]["PointInitial"]["x"]
            let y_ini = res["APS"]["PointInitial"]["y"]
            
            // attributes from the highway reference
            let sca_proj =res["APS"]["AdministratifPointProjete"]["sca"]["nom"]
            let dre_proj =res["APS"]["AdministratifPointProjete"]["dre"]["nom"]
            let district_proj =res["APS"]["AdministratifPointProjete"]["district"]["nom"]
            let ce_proj =res["APS"]["AdministratifPointProjete"]["ce"]["nom"]
            let com_proj =res["APS"]["AdministratifPointProjete"]["commune"]["nom"]
  
            // Setup popup for the futur graphiclayer
            const template_tmp = {
              // autocasts as new PopupTemplate()
              title: "Recherche PR",
              content: [{
                "type": "fields",
                  "fieldInfos": [
                      {
                        "fieldName": "aut",
                        "label": "Autoroute",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                      {
                        "fieldName": "pr",
                        "label": "PR",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                      {
                        "fieldName": "sens",
                        "label": "Sens",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                      {
                        "fieldName": "sca",
                        "label": "SCA",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                      {
                        "fieldName": "dre",
                        "label": "Direction régionale",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                      {
                        "fieldName": "district",
                        "label": "District",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                      {
                        "fieldName": "ce",
                        "label": "Centre d'exploitation",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                      {
                        "fieldName": "commune",
                        "label": "Commune",
                        "isEditable": false,
                        "tooltip": "",
                        "visible": true,
                        "format": null,
                        "stringFieldOption": "text-box"
                      },
                    ]
                  }]
                }
            
            // Creat projected point from result request
            const point_s_tmp = { //Create a point
              type: "point",
              x: x_proj,
              y: y_proj,
              spatialReference: {
                wkid: 102110
              },
            };
            
            // Transform projection point
            const WGS84 = new SpatialReference({ wkid: 4326});
            projection.load().then(function(){
              let point_s = projection.project(point_s_tmp, WGS84);
              console.log(point_s);  
            
            // Symbology projected  point
            const simpleMarkerSymbol = {
              type: "simple-marker",
              color: [226, 119, 40],  // Orange
              outline: {
                  color: [255, 255, 255], // White
                  width: 1
              }
            };
            
            // Load projected point on graphiclayer
            const pointGraphic_s = new Graphic({
              geometry: point_s,
              symbol: simpleMarkerSymbol,
              popupTemplate: template_tmp ,
              popupEnable:true,
              listMode:"hide"
            });
            
            // Setup attribute to get popup
            pointGraphic_s.attributes = {
              "aut":aut_value,
              "pr":pr_value,
              "sens":sens_value,
              "sca": sca_proj,
              "dre": dre_proj,
              "district":district_proj,
              "ce":ce_proj,
              "commune": com_proj,
            };
            // Add the projected point to the map
            graphicsLayer.add(pointGraphic_s);
  
            console.log(pointGraphic_s)

            if(deport_value>0){
              //Creat initial point
              const point2_s= { //Create a point
                type: "point",
                x: x_ini,
                y: y_ini,
                spatialReference: {
                  wkid: 102110
                },
              };

              // Symbology intial point
              const simpleMarkerSymbol2_s= {
                type: "simple-marker",
                color: [240, 0, 32],  // rouge
                outline: {
                    color: [255, 255, 255], // White
                    width: 1
                }
              };

              // Creat the path between projected and initial point
              paths=[[x_proj,y_proj],[x_ini,y_ini]]
              const line_s = new Polyline({
                hasZ: false,
                hasM: false,
                paths: paths,
                spatialReference: { wkid: 102110 }
              });

              // Symbology the path between projected and initial point
              const lineSymbol_s = {
                type: "simple-line", // autocasts as SimpleLineSymbol()
                color: [0, 0, 0],
                width: 2
              };

              //Setup popup for the initial point
              const template_tmp_s = {
                // autocasts as new PopupTemplate()
                title: "Recherche PR",
                content: [{
                  "type": "fields",
                    "fieldInfos": [
                        {
                          "fieldName": "aut",
                          "label": "Autoroute",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "pr",
                          "label": "PR",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "sens",
                          "label": "Sens",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "sca",
                          "label": "SCA",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "dre",
                          "label": "Direction régionale",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "district",
                          "label": "District",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "ce",
                          "label": "Centre d'exploitation",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "commune",
                          "label": "Commune",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                        {
                          "fieldName": "deport",
                          "label": "Deport (mètres)",
                          "isEditable": false,
                          "tooltip": "",
                          "visible": true,
                          "format": null,
                          "stringFieldOption": "text-box"
                        },
                      ]
                    }]
                  }
              
              // Load initial point on grapgiclayer
              const pointGraphic2_s = new Graphic({
                geometry: point2_s,
                symbol: simpleMarkerSymbol2_s,
                popupTemplate: template_tmp_s ,
                popupEnable:true,
                listMode:"hide"
              });

              // Set attribute to initial point for popup
              pointGraphic2_s.attributes = {
                "aut":aut_value,
                "pr":pr_value,
                "sens":sens_value,
                "sca": sca_proj,
                "dre": dre_proj,
                "district":district_proj,
                "ce":ce_proj,
                "commune": com_proj,
                "deport":deport_value
              };
              
              // Load the path to graphiclayer
              const lineGraphic_s = new Graphic({
                geometry: line_s,
                symbol: lineSymbol_s,
                listMode:"hide"
              });

              //Add initial point and path to the map
              graphicsLayer.add(lineGraphic_s);
              graphicsLayer.add(pointGraphic2_s);
            }
            
            // When projected point is adding to the map then zoom to it
            graphicsLayer.when(function() {
              view.goTo({center : [point_s.x,point_s.y],
              zoom:18})
            }); // go to the extent of all the graphics in the layer view
          });
          //If the request works but the result is none : inform the user that the paremeters are incorrect
          } catch (error) {
            console.log("Probleme géocodage")
            document.getElementById("run2").textContent += " !! Probleme paramètre(s) en entrée(s) !!";
          }
          
    }
    //If the API doesn't work  : inform the user
    else{
      console.log("Probleme géocodage")
      document.getElementById("run2").textContent += "Probleme technique avec l'API : contacter un administrateur";
    };
    
    }
    xhr.send();
    });


  SupPR.addEventListener("click",() => {
    graphicsLayer.removeAll();
    graphicsLayer.listMode="hide";
    view.popup.close()
  })

  PrClic.addEventListener("change", () => {
    console.log('change')
    const click = view.on("click", function(event) {
      console.log(event.mapPoint)
      console.log(event.mapPoint.x)
      console.log(event.mapPoint.y)
  
      const obj = [{"GeometrieEsriJson": {"x": event.mapPoint.x, "y": event.mapPoint.y, "spatialReference": {"wkid": 102100}},
      "OptionProjection": {"codeSegment": '', "LocalisationPointProjete": 'AutorouteUniquement',
                           "EstUniquementSurReseauVinciAutoroute": 'true'},
      "ThematiquesResultat": ["AdministratifPointInitial", "AdministratifPointProjete", "APS",
                              "PointLePlusProche"]}];
  
      // console.log(obj)
      
      const url_r = 'https://arcgisserverdev.vinci-autoroutes.com/arcgis/rest/services/Referentiel/ReferentielGeocodeurV2/MapServer/exts/Geocodeur/Geom2APS'
    
    // Sending a receiving data in JSON format using GET method
    //      
    var xhr = new XMLHttpRequest();
    var url = url_r+"?GeometrieEtOption=" + encodeURIComponent(JSON.stringify(obj))+"&f=json";
    xhr.open("GET", url, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          // var json = JSON.parse(xhr.responseText);
          let resp = xhr.response
          let res_tmp1 =JSON.parse(resp)
          let res_tmp2=res_tmp1 ["Resultat"]
          let res = res_tmp2[0]
  
          let AUT = res["ApsDebut"]["Segment"]["Autoroute"]
          let PR = res["ApsDebut"]["Pr"]
          let DEPORT =res["ApsDebut"]["Deport"]
          let SENS =res["ApsDebut"]["Segment"]["Sens"]
          let SCA = res["ApsDebut"]["AdministratifPointProjete"]["sca"]["nom"]
          let DRE = res["ApsDebut"]["AdministratifPointProjete"]["dre"]["nom"]
          let DIST = res["ApsDebut"]["AdministratifPointProjete"]["district"]["nom"]
          let CE = res["ApsDebut"]["AdministratifPointProjete"]["ce"]["nom"]
          let COM = res["ApsDebut"]["AdministratifPointInitial"]["commune"]["nom"]
          let code_INSEE =res["ApsDebut"]["AdministratifPointInitial"]["commune"]["code"]
  
          let x_proj =res["ApsDebut"]["PointProjete"]["x"]
          let y_proj =res["ApsDebut"]["PointProjete"]["y"]
  
          let x_proj2=res["ApsDebut"]["PointInitial"]["x"]
          let y_proj2=res["ApsDebut"]["PointInitial"]["y"]
          
  
          const point = { //Create a point
            type: "point",
            longitude: event.mapPoint.longitude,
            latitude: event.mapPoint.latitude,
          };
  
  
          const point2 = { //Create a point
          type: "point",
          x: x_proj,
          y: y_proj,
          spatialReference: {
            wkid: 102110
          },
        };
  
        paths=[[x_proj,y_proj],[x_proj2,y_proj2]]
        const line = new Polyline({
          hasZ: false,
          hasM: false,
          paths: paths,
          spatialReference: { wkid: 102110 }
        });
  
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],  // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 1
            }
          };
  
          const simpleMarkerSymbol2= {
          type: "simple-marker",
          color: [240, 0, 32],  // rouge
          outline: {
              color: [255, 255, 255], // White
              width: 1
          }
        };
  
        const lineSymbol = {
        type: "simple-line", // autocasts as SimpleLineSymbol()
        color: [0, 0, 0],
        width: 2
      };
  
          
      const template_tmp = {
      // autocasts as new PopupTemplate()
      title: "PR au clic",
      content: [{
        "type": "fields",
          "fieldInfos": [
              {
                "fieldName": "AUT",
                "label": "Autoroute",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "PR",
                "label": "PR",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "DEPORT",
                "label": "Deport",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "SENS",
                "label": "Sens",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "SCA",
                "label": "SCA",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "DRE",
                "label": "Direction régionale",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "DIST",
                "label": "District",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "CE",
                "label": "Centre d'entretien",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "COM",
                "label": "COMMUNE",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "code_INSEE",
                "label": "INSEE",
                "isEditable": false,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
            ]
          }]
        }
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,
          popupTemplate: template_tmp ,
          popupEnable:true,
          listMode:"hide"
        });
        console.log(Layer.pointGraphic)
        const pointGraphic2 = new Graphic({
          geometry: point2,
          symbol: simpleMarkerSymbol2,
          listMode:"hide"
        });

        const lineGraphic3 = new Graphic({
          geometry: line,
          symbol: lineSymbol,
          listMode:"hide"
        });
        
        
        pointGraphic.attributes = {
          "AUT": AUT,
          "PR": PR,
          "DEPORT":DEPORT,
          "SENS":SENS,
          "SCA": SCA,
          "DRE":DRE,
          "DIST":DIST,
          "CE":CE,
          "COM":COM,
          "code_INSEE":code_INSEE
        };
        // console.log(pointGraphic)
        // console.log(event.mapPoint)
        console.log(pointGraphic)
  
        graphicsLayer.add(pointGraphic);
        graphicsLayer.add(pointGraphic2);
        graphicsLayer.add(lineGraphic3);
  
        view.popup.open({
          popupTemplate: template_tmp,
          // features: [graphic],
          fetchFeatures:true,
  
          location: event.mapPoint
          
          // features: [graphic] 
        });

      
  
    }
  };
  xhr.send();
  event.stopPropagation();
  graphicsLayer.listMode="show"
  PrClic.checked=false;
  view.surface.style.cursor = "";
  PrClic.disabled=""
  click.remove()

removeAllText(document.getElementById("run"));

  })

  
if(PrClic.checked!=true){
  view.surface.style.cursor = "";
  view.popup.close();
  console.log('remove');
  click.remove();

  // PR()
// var test=null
}else{
      document.getElementById("run").textContent += "Cliquer sur la carte!";
      PrClic.disabled="disabled"
      view.surface.style.cursor = "crosshair";
      console.log('Info PR');
      // click.remove()   
}
})
  
    });
    });