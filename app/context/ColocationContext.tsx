// /app/context/ColocationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface ColocationContextType {
  colocation: any;  // Vous pouvez définir un type plus précis
  setColocation: (colocation: any) => void;
  checkUserColocation: () => void;
}

const defaultContext: ColocationContextType = {
  colocation: null,
  setColocation: () => {},
  checkUserColocation: () => {}
};

const ColocationContext = createContext<ColocationContextType>(defaultContext);

interface ColocationProviderProps {
  children: ReactNode;
}

export const ColocationProvider = ({ children }: ColocationProviderProps) => {
  const [colocation, setColocation] = useState(null);

  const checkUserColocation = () => {
    return new Promise((resolve, reject) => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const colocationQuery = query(
          collection(db, "Colocations"),
          where("membres", "array-contains", userId)
        );

        const unsubscribe = onSnapshot(colocationQuery, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            setColocation({
              id: doc.id,
              ...doc.data()
            });
            resolve(doc.data());  // Résoudre la promesse avec les données de la colocation
          } else {
            console.log("L'utilisateur n'appartient à aucune colocation.");
            resolve(null);  // Résoudre la promesse sans données
          }
        }, error => {
          console.error("Error fetching colocation data:", error);
          reject(error);  // Rejeter la promesse en cas d'erreur
        });

        return () => unsubscribe();
      } else {
        console.log("No user is logged in.");
        resolve(null);  // Résoudre la promesse si aucun utilisateur n'est connecté
      }
    });
  };


  useEffect(() => {
    checkUserColocation();
  }, []);

  const value = { colocation, setColocation, checkUserColocation };

  return <ColocationContext.Provider value={value}>{children}</ColocationContext.Provider>;
};

export const useColocation = () => useContext(ColocationContext);
