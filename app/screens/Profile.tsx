import { NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
//import { Button } from 'react-native-paper';
import { UserProfile } from '../firebase/database';
import { handleLogout } from "../firebase/auth";


interface Props {
  navigation: NavigationProp<any, any>;
}
const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, 'profiles', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          console.log('No profile found!');
        }
      }
    };

    fetchUserProfile();
  }, []);
  const renderProfileImage = () => {
    if (userProfile?.photoUri) {
      return <Image source={{ uri: userProfile.photoUri }} style={styles.profileImage} />;
    } else {
      const initials = `${userProfile?.firstName[0] ?? ''}${userProfile?.lastName[0] ?? ''}`;
      return (
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{initials.toUpperCase()}</Text>
        </View>
      );
    }
  };


  return (
    <View style={styles.container}>
      {userProfile && (
        <View style={styles.profileDetails}>
        {renderProfileImage()}
          <Text style={styles.detailText}> {userProfile.firstName} {userProfile.lastName}</Text>
          <Text style={styles.detailText}>Email: {auth.currentUser?.email}</Text>
          <Button title="Déconnexion" onPress={() => handleLogout(navigation)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileDetails: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 18,
    marginVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  initialsCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8871E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  initialsText: {
    color: 'white',
    fontSize: 40,
  },
});

export default ProfileScreen;