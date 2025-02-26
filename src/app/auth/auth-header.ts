import { HttpHeaders } from '@angular/common/http';

export function getAuthHeaders(): HttpHeaders {
  return new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  });
}
