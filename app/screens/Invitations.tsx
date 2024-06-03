import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { db, auth, USERS_COLLECTION } from '../../firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, onSnapshot, runTransaction } from 'firebase/firestore';

const InvitationsScreen = ({ navigation }) => {
    const [invitations, setInvitations] = useState([]);
    useEffect(() => {
        const user = auth.currentUser;
        const q = query(collection(db, "invitations"), where("invitedEmail", "==", user.email), where("status", "==", "pending"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedInvitations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInvitations(fetchedInvitations);
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleAccept = async (invitation) => {
        const colocationRef = doc(db, "Colocations", invitation.colocationId);
        const profileRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
        const invitationRef = doc(db, "invitations", invitation.id);

        try {
            await runTransaction(db, async (transaction) => {
                // Lecture nécessaire dans la transaction pour Firestore
                const profileDoc = await transaction.get(profileRef);
                const colocationDoc = await transaction.get(colocationRef);
                if (!profileDoc.exists() || !colocationDoc.exists()) {
                    throw "Document does not exist!";
                }

                // Mise à jour des documents dans la transaction
                transaction.update(profileRef, { colocations: arrayUnion(invitation.colocationId) });
                transaction.update(colocationRef, { membres: arrayUnion(auth.currentUser.uid) });
                transaction.update(invitationRef, { status: 'accepted' });
            });

            // Navigation après la mise à jour
            navigation.navigate('Ma colocation', { colocationId: invitation.colocationId });
        } catch (error) {
            console.error("Failed to accept invitation: ", error);
        }
    };



    const handleDecline = async (invitation) => {
        // Mise à jour de l'invitation à 'declined'
        const invitationRef = doc(db, "invitations", invitation.id);
        await updateDoc(invitationRef, {
            status: 'declined'
        });

        // Filtrer l'invitation déclinée de l'état
        setInvitations(invitations.filter(inv => inv.id !== invitation.id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.invitationContainer}>
            <Text>{item.inviterId} vous a invité à rejoindre la colocation.</Text>
            <Button title="Accepter" onPress={() => handleAccept(item)} />
            <Button title="Refuser" onPress={() => handleDecline(item)} />
        </View>
    );

    return (
        <View style={styles.container}>
            {invitations.length > 0 ? (
                <FlatList
                    data={invitations}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            ) : (
                <Text>Aucune invitation pour le moment</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    invitationContainer: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 5,
    },
});

export default InvitationsScreen;
