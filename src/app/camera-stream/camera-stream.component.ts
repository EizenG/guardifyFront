import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import * as mediasoupClient from 'mediasoup-client';



@Component({
  selector: 'app-camera-stream',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './camera-stream.component.html',
  styleUrl: './camera-stream.component.scss'
})
export class CameraStreamComponent implements OnInit, OnDestroy {
  
  // public ws: WebSocket
  // public isConnected = false;
  // public videoSrc: string | undefined;

  private ws: WebSocket;
  private device: mediasoupClient.Device | null = null;
  private transport: mediasoupClient.types.Transport | null = null;
  private consumer: mediasoupClient.types.Consumer | null = null;

  translate = inject(TranslateService);

  constructor() {
    this.ws = new WebSocket('ws://102.37.155.75:8080');
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }

  ngOnInit(): void {
    // this.connectToWebSocket();
    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers(): void {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.createTransport();
    };

    this.ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      switch (message.action) {
        case 'createTransportResponse':
          await this.onTransportCreated(message.payload);
          break;
        case 'consumeResponse':
          this.onConsumeResponse(message.payload);
          break;
        case 'error':
          console.error('Server error:', message.message);
          break;
        case 'transportConnected':
          this.onTransportConnected();
          break;
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private createTransport(): void {
    this.ws.send(JSON.stringify({
      action: 'createTransport',
      payload: {}
    }));
  }

  private async onTransportCreated(transportOptions: any): Promise<void> {
    const handlerName = mediasoupClient.detectDevice();

    try {
      // Validate transportOptions
      if (!transportOptions) {
        console.error('Transport options are missing or undefined');
        return;
      }

      // Create device configuration
      const deviceOptions: any = {
        routerRtpCapabilities: transportOptions
      };

      // Add handler name if detected
      if (handlerName) {
        deviceOptions.handlerName = handlerName;
        console.log('Detected device:', handlerName);
      } else {
        console.log('No specific handler detected, using default params.');
      }

      console.log('Creating MediaSoup device with options:', deviceOptions);

      // Create device
      this.device = new mediasoupClient.Device(deviceOptions);

      console.log('Device created, loading...');

      // Load device with router capabilities
      await this.device.load({ routerRtpCapabilities: transportOptions.routerRtpCapabilities });

      console.log('Device loaded successfully');

      // Additional validation
      if (!this.device || !this.device.loaded) {
        console.error('Device not loaded successfully');
        return;
      }

      // Log loaded RTP capabilities for debugging
      console.log('Loaded RTP Capabilities:', JSON.stringify(this.device.rtpCapabilities, null, 2));

      // Create receive transport
      this.transport = this.device.createRecvTransport({
        id: transportOptions.id,
        iceParameters: transportOptions.iceParameters,
        iceCandidates: transportOptions.iceCandidates,
        dtlsParameters: transportOptions.dtlsParameters
      });

      if (!this.transport) {
        console.error('Failed to create transport');
        return;
      }

      console.log('Receive transport created successfully:', this.transport);

      let dtlsparam = transportOptions.dtlsParameters;
      console.log("hhhhhh",dtlsparam)
      this.ws.send(JSON.stringify({
        action: 'connectTransport',
        payload: { dtlsParameters: dtlsparam }
      }));
      // Setup transport connection handler
      this.transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        console.log('Transport connect event triggered');

        try {
          console.log('Transport connection request sent successfully');
          callback(); // Acknowledge successful connection
          console.log('Callback executed successfully');
        } catch (error : any) {
          console.error('Error during transport connection:', error);

          // Handle the error
          if (errback) {
            errback(error);
          }
        }
      });


    } catch (error) {
      console.error('Error creating transport:', error);
      // Optionally, add more detailed error logging
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
    }
  }

  private onTransportConnected(): void{
    // Request to consume stream for specific Raspberry Pi
    this.consumeStream('raspi1');
  }

  private consumeStream(raspID: string): void {
    this.ws.send(JSON.stringify({
      action: 'consume',
      payload: { raspID }
    }));
  }
  

  private onConsumeResponse(consumerOptions: any): void {
    if (!this.device || !this.transport) {
      console.error('Device or transport not ready');
      return;
    }

    console.log('Consumer Options:', JSON.stringify(consumerOptions, null, 2));
    console.log('Device RTP Capabilities:', JSON.stringify(this.device.rtpCapabilities, null, 2));

    try {
      // Consume the stream
      this.transport.consume({
        id: consumerOptions.id,
        producerId: consumerOptions.producerId,
        kind: consumerOptions.kind,
        rtpParameters: consumerOptions.rtpParameters
      }).then((consumer) => {
        this.consumer = consumer;
        console.log('Track ID:', consumer.track.id);
        console.log('Track label:', consumer.track.label);
        console.log('Track kind:', consumer.track.kind);
        console.log('Track enabled:', consumer.track.enabled);
        console.log('Track muted:', consumer.track.muted);
        console.log('Track readyState:', consumer.track.readyState);

       

        // Attach to video element
        const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
        const track = consumer.track;


        // Vérifier à nouveau l'état de la piste
        console.log('Track muted after change:', track.muted);

        // Créer le flux vidéo avec la piste démutée
        const stream = new MediaStream([track]);

     
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.play();
          console.log('Stream tracks:', stream.getTracks());
          videoElement.onloadedmetadata = () => {
            console.log('Metadata loaded');
            videoElement.play().catch((error) => {
              console.error('Error playing the video:', error);
            });
          };

          videoElement.onplaying = () => {
            console.log('Video is playing');
          };

          videoElement.onerror = (error) => {
            console.error('Error with video element:', error);
          };

        } else {
          console.error('Video element not found');
        }
        // Optional: Handle consumer events
        consumer.on('trackended', () => {
          console.log('Consumer track ended');
        });
      });
    } catch (error) {
      console.error('Error consuming stream:', error);
    }
  }

  ngOnDestroy(): void {
    // if (this.ws) {
    //   this.ws.close();
    // }
    this.consumer?.close();
    this.transport?.close();
    this.ws.close();

  }

  // private sendConsumeMessage(): void {
  //   const message = {
  //     action: 'consume',
  //     payload: {
  //       raspID: 'raspi1', 
  //     },
  //   };

  //   this.ws.send(JSON.stringify(message));
  // }

  // private sendCreateTransportMessage(): void {
  //   const message = {
  //     action: 'createTransport',
  //     payload: {},
  //   };

  //   this.ws.send(JSON.stringify(message));
  // }

  // handleCreateTransportResponse(): void {
  //   console.log('Réponse de transport reçue:');
  //   this.sendConsumeMessage();
  // }

  // private handleConsumeResponse(payload: any): void {
  //   // Manipulez les informations reçues, comme le flux vidéo ou autres
  //   console.log('Réponse de consommation reçue:', payload);

  //   // Si le flux vidéo est un lien URL ou autre forme de données, l'afficher
  //   if (payload.rtpParameters && payload.rtpParameters.video) {
  //     this.videoSrc = payload.rtpParameters.video.src; // Exemple : si vous recevez une URL pour le flux vidéo
  //   }
  // }

  // private connectToWebSocket(): void { 
  //   // Lorsque la connexion est ouverte
  //   this.ws.onopen = () => {
  //     this.isConnected = true;
  //     this.sendCreateTransportMessage();
  //   };

  //   // Lorsqu'un message est reçu
  //   this.ws.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     if (message.action === 'consumeResponse') {
  //       this.handleConsumeResponse(message.payload);
  //     } else if (message.action === 'createTransportResponse'){
  //       this.handleCreateTransportResponse();
  //     } else {
  //       console.log('Message inconnu:', message);
  //     }
  //   };

  //   // Lors de la fermeture de la connexion WebSocket
  //   this.ws.onclose = () => {
  //     this.isConnected = false;
  //   };

  //   // Gérer les erreurs de connexion WebSocket
  //   this.ws.onerror = (error) => {
  //     console.error('Erreur WebSocket:', error);
  //   };
  // }

  previousWindows(): void{
    window.history.back();
  }
}
