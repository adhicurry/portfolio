import { permanentRedirect } from "next/navigation";

export default function PublicationsPage() {
  permanentRedirect("/#papers");
}
