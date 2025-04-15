import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.services';
import { SnackbarConfig, SnackbarService } from '../../services/snackbar.service';
import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectItem, SelectModule } from 'primeng/select';
import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
import { AddDialogComponent, Field } from '../../layout/component/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../layout/component/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../../layout/component/delete-dialog/delete-dialog.component';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        TableModule, ButtonModule, TagModule, SelectModule,
        CommonModule, SnackbarComponent, IconFieldModule, InputIconModule, MultiSelectModule,
        EditDialogComponent, DeleteDialogComponent, AddDialogComponent, InputText
    ],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
    users: User[] = [];
    loading: boolean = true;
    selectedUser: User | null = null;
    editDialogVisible: boolean = false;
    deleteDialogVisible: boolean = false;
    userToDelete: User | null = null;
    addDialogVisible: boolean = false;
    snackbarVisible: boolean = false;
    snackbarConfig: SnackbarConfig = {
        type: 'success',
        title: '',
        message: '',
        duration: 3000,
    };

    userEditFields: Field[] = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            pattern: '^(?!\\s*$)[a-zA-Z\\s]+$',
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
        },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            options: [
                { label: 'Select Role', value: '' },
                { label: 'Admin', value: 'admin' },
                { label: 'Cashier', value: 'cashier' },
                { label: 'Inventory Manager', value: 'inventoryManager' },
            ],
            required: true,
        },
        {
            name: 'mobileNumber',
            label: 'Mobile Number',
            type: 'tel',
            required: true,
            pattern: '^[0-9]{10}$',
        },
        {
            name: 'dateOfBirth',
            label: 'Date Of Birth',
            type: 'date',
            maxDate: new Date(),
            required: true,
        },
        {
            name: 'isActive',
            label: 'Is Active',
            type: 'select',
            options: [
                { label: 'Active', value: true },
                { label: 'Inactive', value: false },
            ],
            required: true,
        }
    ];

    userAddFields: Field[] = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            pattern: '^(?!\\s*$)[a-zA-Z\\s]+$',
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
        },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            options: [
                { label: 'Select Role', value: '' },
                { label: 'Admin', value: 'admin' },
                { label: 'Cashier', value: 'cashier' },
                { label: 'Inventory Manager', value: 'inventoryManager' },
            ],
            required: true,
        },
        {
            name: 'mobileNumber',
            label: 'Mobile Number',
            type: 'tel',
            required: true,
            pattern: '^[0-9]{10}$',
        },
        {
            name: 'dateOfBirth',
            label: 'Date Of Birth',
            type: 'date',
            maxDate: new Date(),
            required: true,
        },
        {
            name: 'userImg',
            label: 'Profile Picture',
            type: 'file',
            required: true,
        },
    ];
    private snackbarSubscriptions: Subscription[] = [];
    FormData: FormData | undefined;


    constructor(private userService: UserService, private snackbarService: SnackbarService) { }

    ngOnInit(): void {
        this.loadUsers();
        this.snackbarSubscriptions.push(
            this.snackbarService.visible$.subscribe(
                visible => this.snackbarVisible = visible
            )
        );

        this.snackbarSubscriptions.push(
            this.snackbarService.config$.subscribe(
                config => this.snackbarConfig = config
            )
        );
    }
    ngOnDestroy(): void {
        this.snackbarSubscriptions.forEach(sub => sub.unsubscribe());
        this.snackbarService.hideSnackbar();
    }

    loadUsers(): void {
        this.loading = true;
        this.userService.getAllUsers().subscribe({
            next: (response: ApiResponse) => {
                this.users = response.data;
                this.users = this.users.map(user => ({
                    ...user,
                    profilePicture: user.profilePicture
                }));
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading users:', error);
                this.loading = false;
            }
        });
    }

    openAddDialog(): void {
        this.addDialogVisible = true;
    }

    createUser(formData: FormData): void {

        this.userService.createUser(formData).subscribe({
            next: (response: any) => {
                if (response.success) {
                    this.loadUsers();
                    this.addDialogVisible = false;
                    this.snackbarService.showSuccess(
                        'User Created',
                        'The user has been added successfully!'
                    );
                }
            },
            error: (error) => {
                console.error('Error creating user:', error);
                this.snackbarService.showError(
                    'Error',
                    'Failed to create user!.'
                );
            }
        });
    }

    openEditDialog(user: User): void {
        this.selectedUser = { ...user };
        if (this.selectedUser.dateOfBirth && typeof this.selectedUser.dateOfBirth === 'string') {
            this.selectedUser = {
                ...this.selectedUser,
                dateOfBirth: new Date(this.selectedUser.dateOfBirth)
            };
        }
        this.editDialogVisible = true;
    }

    updateUser(updatedUserFromDialog: any): void {
        if (!this.selectedUser || !this.selectedUser._id) return;
    
        const userId = this.selectedUser._id;
    
        let profilePictureToUpdate = updatedUserFromDialog.profilePicture;
    
        if (updatedUserFromDialog.profilePicture && updatedUserFromDialog.profilePicture.startsWith(environment.imageUrl)) {
            profilePictureToUpdate = updatedUserFromDialog.profilePicture.replace(environment.imageUrl, '');
        }
    
        const updatedUser = {
            ...updatedUserFromDialog,
            profilePicture: profilePictureToUpdate,
            _id: userId 
        };
        this.userService.updateUser({ user: updatedUser, _id: userId }).subscribe({
            next: () => {
                this.loadUsers();
                this.editDialogVisible = false;
                this.snackbarService.showSuccess(
                    'User Updated',
                    'User details updated successfully!'
                );
            },
            error: (error) => {
                console.error('Error updating user:', error);
                this.snackbarService.showError(
                    'Error',
                    'Failed to update user. Please try again!'
                );
            }
        });
    }

    openDeleteDialog(user: User): void {
        this.userToDelete = user;
        this.deleteDialogVisible = true;
    }

    confirmDelete(): void {
        if (!this.userToDelete || !this.userToDelete._id) return;

        this.userService.deleteUser(this.userToDelete._id).subscribe({
            next: () => {
                this.loadUsers();
                this.userToDelete = null;
                this.deleteDialogVisible = false;
                this.snackbarService.showSuccess(
                    'User Deleted',
                    'The user has been removed successfully!'
                );
            },
            error: (error) => {
                console.error('Error deleting user:', error);
                this.snackbarService.showError(
                    'Error',
                    'Failed to delete user. Please try again!'
                );
            }
        });
    }

    getSeverity(isActive: boolean): 'success' | 'danger' {
        return isActive ? 'success' : 'danger';
    }
}
