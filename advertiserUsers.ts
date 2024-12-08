export interface AdvertiserUser {
  name: string;
  email: string;
}

/** Names for users that are allowed to bypass the KuoLO user check */
const advertiserUsers: AdvertiserUser[] = [
  {
    name: "Testimainostaja",
    email: "testi@kuolo.fi",
  },
];

export default advertiserUsers;
