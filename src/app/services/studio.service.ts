
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database'; // Import AngularFireDatabase
import { AngularFireStorage } from '@angular/fire/storage';
import { Studio } from './model/studio.model';
import { Reservation } from './model/reservation.model';
import { Service } from './model/service.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class StudioService {

    currentStudio: Studio;

    constructor(private db: AngularFireDatabase, private router: Router, private storage: AngularFireStorage) {
      this.initializeCurrentStudio();
    }

    initializeCurrentStudio() {
      const storedObject = localStorage.getItem('studio');
      this.currentStudio = storedObject ? JSON.parse(storedObject) : null;
    }

    saveCurrentStudioToLocalStorage(studio: Studio): void {
      const studioString = JSON.stringify(studio);
      localStorage.setItem('studio', studioString);
      this.currentStudio = studio;
    }


    getStudios(): Observable<Studio[]> { // Specify the return type as User[]
      return this.db.list('studios').snapshotChanges().pipe(
        map(changes => {
          return changes.map(c => ({
            id: c.payload.key, // Extract the key (ID) from the payload
            ...c.payload.val() as Studio // Include the rest of the payload as the Studio data
          }));
        })
      );
      }

      getReservationsByUsername(username: string): Observable<Reservation[]> {
        console.log(username)
        return this.getStudios().pipe(
          map(studios => {
            let reservations: Reservation[] = [];
            studios.forEach(studio => {
              if(studio.service){
                 studio.service.forEach(service => {
                console.log(service);
                if(service.reservations){
                  reservations = reservations.concat(service.reservations.filter(reservation => reservation.username === username));
                }
                
              });
              }
             
            });
            return reservations;
          })
        );
      }

      addStudio(studio: Studio) {
        
        this.getNewId().then((newId) => {
          studio.id = newId.toString();
          this.db.list('studios').set(newId.toString(), studio)
            .then(() => {
              this.router.navigate(['/studio-main-page',studio.type]);      
            })
            .catch((error) => {
              console.error('Error adding user:', error);
            });
        });
      }

      editStudio(studioId: string, updatedStudio: Studio): Promise<void> {
        return this.db.list('studios').update(studioId, updatedStudio)
          .then(() => {
            // Navigate to the studio main page or any other page as needed
            this.router.navigate(['/studio-main-page', updatedStudio.type]);
          })
          .catch((error) => {
            console.error('Error editing studio:', error);
          });
          
      }

      editStudioReservations(studioId: string, updatedStudio: Studio): Promise<void> {
        return this.db.list('studios').update(studioId, updatedStudio)
          .then(() => {
            
          })
          .catch((error) => {
            console.error('Error editing studio:', error);
          });
        }
        
      getNewId(): Promise<number> {
        return new Promise((resolve, reject) => {
          this.db.list<number>('studios').query.once('value')
            .then((snapshot) => {
              let highestNumber = 0;
    
              snapshot.forEach((userSnapshot) => {
                const userId = parseInt(userSnapshot.key, 10);
                if (!isNaN(userId) && userId > highestNumber) {
                  highestNumber = userId;
                }
              });
    
              const nextAvailableNumber = highestNumber + 1;
              console.log('Next available number:', nextAvailableNumber);
              resolve(nextAvailableNumber);
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
              reject(error);
            });
        });
      }
      
     addTestStudio(){
        const reservations: Reservation[] = [
            {
              username: 'user1',
              confirmed: 'true',
              startDate: '2023-10-01 08:30',
              endDate: '2023-10-01 09:00'
            },
            {
              username: 'user2',
              confirmed: 'false',
              startDate: '2023-10-01 09:30',
              endDate: '2023-10-01 10:00'
            },
            // Add more reservations as needed...
          ];
          
          // Sample Service objects
          const services: Service[] = [
            {
              title: 'Service 1',
              description: 'Description for Service 1',
              reservations: reservations,
            },
            {
              title: 'Service 2',
              description: 'Description for Service 2',
              reservations: [],
            },
            // Add more services as needed...
          ];
          
          // Sample Studio object
          const studio: Studio = {
            id: "1",
            studioName: 'name',
            type: 'Studio Type',
            location: 'Studio Location',
            ownerUsername: 'owner123',
            ownerEmail: 'test@email.com',
            service: services,
            imageUrl: "test",
          };
              
          // Add the test user using the service
          this.addStudio(studio);
     } 
     
     uploadFile(file: File): Promise<string> {
      const path = `/uploads/${new Date().getTime()}_${file.name}`;
      const storageRef = this.storage.ref(path);
    
      return storageRef.put(file).then(() => {
        return storageRef.getDownloadURL().toPromise();
      });
    }

    uploadServiceFile(file: File): Promise<string> {
      const path = `/uploads/services/${new Date().getTime()}_${file.name}`;
      const storageRef = this.storage.ref(path);
    
      return storageRef.put(file).then(() => {
        return storageRef.getDownloadURL().toPromise();
      });
    }

    saveImageUrlToDatabase(imageUrl: string) {
      const data = { imageUrl: imageUrl };
      console.log(data);
    }

    deleteStudio(studioId: string): Promise<void> {
      return this.db.list('studios').remove(studioId)
        .then(() => {
          
        })
        .catch((error) => {
          console.error('Error deleting studio:', error);
        });
    }
}