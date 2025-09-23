import { DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointments-list";
import { formatCurrency } from "@/utils/formatCurrency";

interface DialogAppointmentProps{
    appointment: AppointmentWithService | null;
}

export function DialogAppointment({appointment}: DialogAppointmentProps){
    return(
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Scheduling details:</DialogTitle>

                <DialogDescription>See all the appointment details</DialogDescription>
            </DialogHeader>

            <div className="py-4">
                {appointment && (
                    <article>
                        <p><span className="font-semibold">Scheduled time:</span> {appointment.time}</p>

                        <p className="mb-2"><span className="font-semibold">Date:</span> {new Intl.DateTimeFormat("es",{
                            timeZone: "UTC",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }).format(new Date(appointment.appointmentDate))}
                        </p>

                        <p><span className="font-semibold">Patient's name:</span> {appointment.name}</p>

                        <p><span className="font-semibold">Phone:</span> {appointment.phone}</p>

                        <p><span className="font-semibold">Email:</span> {appointment.email}</p>

                        <section className="bg-gray-100 mt-4 p-2 rounded-md">
                            <p><span className="font-semibold">Service to be performed:</span> {appointment.service.name}</p>

                            <p><span className="font-semibold">Price:</span> {formatCurrency((appointment.service.price / 100))}</p>
                        </section>
                    </article>
                )}
            </div>
        </DialogContent>
    )
}