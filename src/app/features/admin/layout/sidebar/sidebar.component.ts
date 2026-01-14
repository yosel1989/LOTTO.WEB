import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileEnum } from 'app/core/enums/profile.enum';
import { StorageService } from 'app/core/services/storage.service';
import { AuthApiService } from 'app/features/auth/services/auth-api.service';
import { User } from 'app/features/auth/services/auth.interface';
import { environment } from 'environments/environment';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
    user: User | null = null;
    profileEnum = ProfileEnum;

    bgBackground = "";

    constructor(
      public authApi: AuthApiService,
      private storageService: StorageService
    ) {
      this.bgBackground = environment.production ? "bg-background" : "bg-blue"
    }
  
    ngOnInit(): void {
      this.user = this.storageService.getUser();
    }

    hasProfile(profile: number): boolean{
      const profileIds = this.user?.profiles.map((x: any) => x.id);
      return profileIds?.includes(profile) ?? false;
    }
}
