// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: "http://localhost:8080/",
  //apiUrl: "http://localhost:8080/api/",
  //apiUrl: "http://ec2-18-230-199-42.sa-east-1.compute.amazonaws.com:8080/api/",
  apiUrl: "https://donde-comemos-back.herokuapp.com/api/",
  firebaseConfig: {
    apiKey: "AIzaSyCzIqBkghJT6vmQ0hMmo6DL40AZ6tHmRQg",
    authDomain: "dondecomemos-a73db.firebaseapp.com",
    databaseURL: "https://dondecomemos-a73db.firebaseio.com",
    projectId: "dondecomemos-a73db",
    storageBucket: "dondecomemos-a73db.appspot.com",
    messagingSenderId: "958354498223",
    appId: "1:958354498223:web:eb84913f3d35a510662a5a",
    measurementId: "G-CYC165Z6J7"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
