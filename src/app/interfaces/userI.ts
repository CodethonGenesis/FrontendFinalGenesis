export interface UserI {
  id?: number;
  userName: string;      // Required, @NotBlank
  password: string;      // Required, @NotBlank, @Size(min = 5)
  email?: string;       // Optional but must be valid email if provided
  name?: string;        // Optional
  lastName?: string;    // Optional
  documento?: string;   // Optional
  registro?: Date;      // Optional
}
