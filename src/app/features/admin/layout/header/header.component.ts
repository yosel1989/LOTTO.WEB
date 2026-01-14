import { Component, OnInit } from '@angular/core';
import { StorageService } from 'app/core/services/storage.service';
import { AuthApiService } from 'app/features/auth/services/auth-api.service';
import { User } from 'app/features/auth/services/auth.interface';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-header',
  imports: [TagModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  user: User | null = null;

  constructor(
    public authApi: AuthApiService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    //console.log(this.user);
  }

  logout(): void{
    this.authApi.logout().subscribe((res) => {
      console.log('Logged out successfully');
    });
  }

  getProfileName(idSystem: number): string {
      return this.user?.profiles.find(profile => profile.appId === idSystem)?.description || 'Sin Perfil';
  }

}
