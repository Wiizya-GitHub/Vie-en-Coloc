import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

async function inviterUtilisateur(email, colocationId, inviterId) {
    // Créer une référence à la collection des invitations
    const invitationsRef = collection(db, "invitations");

    // Définir la requête pour rechercher des invitations existantes
    const q = query(invitationsRef,
        where("invitedEmail", "==", email),
        where("colocationId", "==", colocationId),
        where("status", "==", "pending")
    );

    // Exécuter la requête
    const querySnapshot = await getDocs(q);

    // Vérifier si une invitation existe déjà
    if (querySnapshot.empty) {
        // Aucune invitation existante, créer une nouvelle invitation
        const invitationRef = doc(invitationsRef);
        await setDoc(invitationRef, {
            invitedEmail: email,
            colocationId: colocationId,
            inviterId: inviterId,
            status: "pending"
        });
        console.log("Invitation envoyée à :", email);
    } else {
        // Une invitation existe déjà, ne pas créer de doublon
        console.log("Une invitation existe déjà pour cette personne et cette colocation.");
    }
}

export default inviterUtilisateur;