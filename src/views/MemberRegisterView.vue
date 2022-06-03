<template>
	<div>
		<b-container>
			<b-row>
				<b-col cols="3"></b-col>
				<b-col cols="6">
					<b-form @submit="onSubmit" @reset="onReset">
						<b-form-group
							id="input-group-1"
							:label="`Email address: ${emailMessage}`"
							label-for="input-1"
							description="We'll never share your email with anyone else."
						>
							<b-form-input
								id="input-1"
								v-model="form.email"
								type="email"
								placeholder="Enter email"
                                @blur.native="checkEmailValid"
								required
							></b-form-input>
						</b-form-group>

						<b-form-group id="input-group-2" :label="`Your ID: ${idMessage}`" label-for="input-2">
							<b-form-input
								id="input-ID"
								v-model="form.userid"
								placeholder="Enter ID"
                                @blur.native="checkUserIDValid"
								required
							></b-form-input>
						</b-form-group>

						<b-form-group id="input-group-3" label="Your Password" label-for="input-2">
							<b-form-input
								id="input-3"
								v-model="form.userpwd"
								placeholder="Enter Password"
                                type="password"
                                @blur.native="userPwdCheck=''"
								required
							></b-form-input>
						</b-form-group>

                        <b-form-group id="input-group-4" :label="`Password Check: ${passwordMessage}`" label-for="input-2">
							<b-form-input
								id="input-4"
								v-model.lazy="userPwdCheck"
								placeholder="Enter Password"
                                type="password"
                                @blur.native="checkPasswordValid"
								required
							></b-form-input>
						</b-form-group>

						<b-form-group id="input-group-4" label="Your Name" label-for="input-2">
							<b-form-input
								id="input-2"
								v-model="form.username"
								placeholder="Enter name"
								required
							></b-form-input>
						</b-form-group>

						<b-button type="submit" variant="primary">Submit</b-button>
						<b-button type="reset" variant="danger">Reset</b-button>
					</b-form>
				</b-col>
				<b-col cols="3"></b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
/* eslint-disable-next-line */
const emailRegex = /.+\@.+\..+/;
import axios from "@/router/api.js";
export default {
	name: 'HappyhouseVueMemberRegisterView',
	components: {},
	data() {
		return {
			form: {
				email: '',
				userid: '',
				username: '',
				userpwd: '',
			},
            userPwdCheck :'',
            // 각각 Email, id, passwordcheck
            emailMessage : "",
            idMessage : "",
            passwordMessage : "",
		};
	},

	mounted() {},

	methods: {
        onSubmit(event) {
            event.preventDefault();
            if(this.emailMessage != "valid" || this.idMessage != "valid" || this.passwordMessage != "valid"){
                alert("형식이 잘못되었습니다.");
                return;
            }

            axios.post("/user/register", this.form)
            .then(res => {
                let data = res.data;
                if(data.message == "success"){
                    alert(data.message);
                    this.$router.push("/");
                }
            })
            .catch(err => {
                alert(err);
                console.error(err); 
            })
		},
		onReset(event) {
			event.preventDefault();
			// Reset our form values
			this.form.email = '';
			this.form.userid = '';
			this.form.username = '';
			this.form.userpwd = '';
            this.userPwdCheck = '';
            this.message = '';
		},

        checkEmailValid(){
            if(this.form.email.match(emailRegex)){
                this.emailMessage = "valid";
            }else{
                this.emailMessage = "invlid email format.";
            }
        },
        async checkUserIDValid(){
            axios.get("/user/idcheck/"+this.form.userid).then(res=>{
                if(res.data.result == true){
                    this.idMessage = "valid";
                }else{
                    this.idMessage = "Already exists id";
                }
            })
        },
        checkPasswordValid(){
            if(this.form.userpwd != this.userPwdCheck){
                this.passwordMessage = "Password is not match.";
            } else if(this.userPwdCheck.length <= 5){
                this.passwordMessage = "Password is too short.";
            }
            else{
                this.passwordMessage = "valid";
            }
        }
	}
};
</script>

<style lang="scss" scoped></style>
