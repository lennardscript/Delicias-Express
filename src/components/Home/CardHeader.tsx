import { auth, firestore } from "@/utils/firebase/firebase";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function CardHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(firestore, "users", user.uid));

        if (userDoc.exists()) {
          setName(userDoc.data().name);
        }
      } else {
        setUser(null);
        setName(null);
      }
    });

    return () => unsubscribe();
    {
    }
  }, []);

  return (
    <>
      <div className="row-cols-2">
        <div className="col-xl-2 offset-sm-3 col-sm-6 mb-xl-0 mb-2">
          <div className="card">
            <div className="card-header p-3 pt-1">
              <div className="icon icon-lg icon-shape bg-danger shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                <i className="material-icons opacity-10">person</i>
              </div>
              <div className="text-end pt-4">
                <p className="text-sm mb-0 text-capitalize">Bienvenido(a)!</p>
                <h4 className="mb-0">
                  {name || "Invitado"} {user ? "👋" : "👤"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
