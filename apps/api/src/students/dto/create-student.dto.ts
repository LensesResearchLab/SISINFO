import { CreateUserDto } from "src/common/dto/create-user.dto";

export class CreateStudentDto extends CreateUserDto{

    semester: number;

    isUndergraduate: boolean;

    isTeachingAssistant: boolean;

    code: string;
}
