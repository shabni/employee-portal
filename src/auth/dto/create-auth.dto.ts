import { ApiProperty } from "@nestjs/swagger";

export class LogInDto {
    @ApiProperty()
    userName: string

    @ApiProperty()
    password: string
}

export class logInUserDto {
    @ApiProperty()
    is_LoggedIn: boolean
}

export class logOutUserDto {
    @ApiProperty()
    user_id: string

    @ApiProperty()
    userName: string
}

export class createSessionDto {

    @ApiProperty()
    user_id:        string   
    @ApiProperty()  
    fName?:        string

    @ApiProperty() 
    lName?:        string

    @ApiProperty() 
    userName:        string
    
    @ApiProperty() 
    password :        string

    @ApiProperty() 
    fatherName?:        string

    @ApiProperty() 
    joining_date?:      bigint

    @ApiProperty() 
    is_LoggedIn?:      boolean
    
    @ApiProperty() 
    is_CheckedIn?:      boolean
    
    @ApiProperty() 
    role_id?:      string

    @ApiProperty() 
    emailOffice?:      string

    @ApiProperty() 
    address?:      string

    @ApiProperty() 
    phone?:            number

    @ApiProperty() 
    date_updated?:   bigint

    @ApiProperty() 
    date_added?:   bigint

    @ApiProperty() 
    is_deleted?:   boolean

    @ApiProperty() 
    attendence_date?:   bigint

    @ApiProperty() 
    check_in_time?:   bigint

    @ApiProperty() 
    check_out_time?:   bigint
}