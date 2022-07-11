import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {deleteDoc,doc,onSnapshot,setDoc,updateDoc,} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase/FirebaseHelper";

const CardMap = (props) => {
    const [center, setCenter] = useState({ lat: -6.200110703081585, lng: 106.78388834110297 });
    const [centerMarker, setCenterMarker] = useState(false);
    
    useEffect(() => {
    const unsub = onSnapshot(doc(db, "CardLocation", props.card), (snap) => {
      if (!snap.empty) {
        setCenter({ lat: snap.data().marker.lat, lng: snap.data().marker.lng });
        setCenterMarker({
          lat: snap.data().marker.lat,
          lng: snap.data().marker.lng,
        });
      } else {
        setCenter({ lat: -6.200110703081585, lng: 106.78388834110297 });
        setCenterMarker(false);
      }
    });
    return unsub;
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCuKwJ-rZ1RFll_Vtaff-uT8NxDbmodILY",
  });

  if (!isLoaded) return null;

  const handleClick = (e) => {
    setCenterMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setDoc(doc(db, "CardLocation", props.card), {
      marker: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    });
  };

  return (
    <div className="relative w-1/3">
      <div
        onClick={() => {
          deleteDoc(doc(db, "CardLocation", props.card));
          setCenterMarker(false);
        }}
        className="cursor-pointer absolute text-blue-500 right-[5rem] top-2"
        href=""
      >
        Remove Marker
      </div>
      <svg
        onClick={() => {
          deleteDoc(doc(db, "CardLocation", props.card));
          setCenter({ lat: -6.2236675, lng: 106.781525 });
          setCenterMarker(false);

          updateDoc(doc(db, "card", props.card), {
            location: null,
          });
        }}
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 stroke-blue-600/0 absolute right-10 cursor-pointer top-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      <p className="p-2 font-medium bg-blue-200 rounded">Card Location</p>
      <div className="p-3">
        <GoogleMap
          onClick={handleClick}
          center={center}
          zoom={15}
          mapContainerClassName="w-full h-[32rem]"
        >
          {centerMarker && <Marker position={centerMarker} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default CardMap;