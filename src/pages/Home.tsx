import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RyobiApi } from "../utils/ryobi-api";

(window as any).ryobi = new RyobiApi();

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ryobi GDO</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg">Status: Unknown</p>
          <IonProgressBar color="primary" value={0.2} />
          <div className="flex space-x-4">
            <IonButton size="default">Open</IonButton>
            <IonButton size="default">Close</IonButton>
          </div>
          <div className="mx-auto">
            <IonButton size="default">Toggle light</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
