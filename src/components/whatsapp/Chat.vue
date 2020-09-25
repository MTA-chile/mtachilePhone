<template>
	<v-app>
		<v-content>
<v-card class="overflow-hidden">
	<div>
		<ChatTopBar></ChatTopBar>
		<v-sheet id="" class="overflow-y-auto" max-height="600">
			<v-container class="pa-0 pt-2 grey lighten-2 back subtitle-2" style="height: 90vh;margin:0">
				<template v-for="(message, index) in messages">
					<v-card
						v-if="message.direction == 'incoming'"
						:key="index"
						:class="{ 'chat-bubble mt-1': firstDirection(message, index) }"
						class="left mx-3 mb-1 px-2 py-1 float-left"
						min-width="50%"
						max-width="80%"
					>
						<div class="hide-overflow">
							{{ message.text }}
						</div>
						<span class="float-right mt-1 pl-2" style="height:18px;">
							<span class="caption grey--text text--darken-1"> {{ message.time }} </span>
						</span>
					</v-card>

					<v-card
						v-else-if="message.direction == 'outgoing'"
						:key="index"
						:class="{ 'chat-bubble mt-1': firstDirection(message, index) }"
						class="right mx-3 mb-1 px-2 py-1 float-right msg lighten-3"
						min-width="50%"
						max-width="80%"
					>
						<div class="hide-overflow">
							{{ message.text }}
						</div>
						<span class="float-right mt-1 pl-2" style="height:18px;">
							<span class="caption grey--text text--darken-1"> {{ message.time }} </span>
							<v-icon v-if="message.status == 'received'" size="18" class="mt-n1" color="grey lighten-0">mdi-check-all</v-icon>
							<v-icon v-else-if="message.status == 'read'" size="18" class="mt-n1" color="blue lighten-2">mdi-check-all</v-icon>
						</span>
					</v-card>
				</template>

				<ChatBox></ChatBox>
			</v-container>
		</v-sheet>
	</div>
			</v-card>
		</v-content>
	</v-app>
</template>

<script>
import Vue from 'vue';
import ChatTopBar from './ChatTopBar.vue';
import ChatBox from './ChatBox.vue';

export default Vue.extend({
	components: { ChatTopBar, ChatBox },
	data() {
		return {
			messages: [
				{
					direction: 'incoming',
					text: `Hola`,
					time: '8:10pm'
				},
				{
					direction: 'incoming',
					text: `uwu`,
					time: '8:11pm'
				},
				{
					direction: 'outgoing',
					text: `sdf  sdfhsdkj fhfkjdsfdsfds fsdfsdf`,
					status: 'received/read',
					time: '8:18pm'
				},
				{
					direction: 'outgoing',
					text: `sdfsdfhsdkjfhjds hfjkdshfhjdkshfkj dsfdsfdsfsdfsdf`,
					status: 'read',
					time: '8:19pm'
				},
				{
					direction: 'outgoing',
					text: `sdfsdf hsdkjfhk dhjkfhds fhjdkshdsfsdfsdf`,
					status: 'read',
					time: '8:20pm'
				},
				{
					direction: 'incoming',
					text: 'sdfsdfhs dkdshfjkdshfj ksdhjkfhds dsfdsfdsfsdfsdf',
					time: '9:00pm'
				},
				{
					direction: 'incoming',
					text: 'sdfsdfh sdkjfhj dshfjsfdsfsdfsdf',
					time: '9:02pm'
				},
				{
					direction: 'outgoing',
					text: 'sdfsdfhsdkjf hjdshfj jdkshfkjdsfds fdsfsdfsdf',
					status: 'received',
					time: '9:03pm'
				}
			],
			lastMessage: {}
		};
	},
	methods: {
		firstDirection(message, index) {
			if (index == 0) {
				return true;
			}
			const check = message.direction != this.messages[index - 1].direction;

			return check;
		}
	}
});
</script>

<style scoped>
.msg{
	background: #dcf8c6!important;
}
.back {
	background-image: url('../../assets/whatsapp/background.png');
	background-size: 140% 140%;
}

.hide-overflow {
	display: inline;
	overflow: hidden;
}

.chat-bubble::after {
	content: '';
	position: absolute;
	top: 10px;
	width: 0;
	height: 0;
	border: 12px solid transparent;
	border-left-color: #dcf8c6!important;
	border-top: 0;
	margin-top: -10px;
}

.chat-bubble.left::after {
	left: 0;
	border-right-color: inherit;
	border-left: 0;
	margin-left: -10px;
}

.chat-bubble.right::after {
	right: 0;
	border-left-color: inherit;
	border-right: 0;
	margin-right: -10px;
}

.chat-bubble.left {
	border-top-left-radius: 0px;
}

.chat-bubble.right {
	border-top-right-radius: 0px;
}
</style>
