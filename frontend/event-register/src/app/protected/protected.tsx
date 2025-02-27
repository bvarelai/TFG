import { Callout, Link} from "@radix-ui/themes";
import { InfoCircledIcon} from "@radix-ui/react-icons"

export default async function Protected() {
    
    return(
        <div id="protected-first-div" className="min-h-screen flex flex-col justify-center items-center">
            <div id="protected-second-div" className="flex flex-col items-center border-2 border-solid border-white/[.08]">
            <Callout.Root color="blue" size="2" variant="outline">
	        	<Callout.Icon className="callout-icon-large" >
			        <InfoCircledIcon  />
		        </Callout.Icon>
		        <Callout.Text className="callout-text-large">
			    Es necesario <Link href="/login">hacer un login</Link> para poder acceder a los eventos de la aplicación.
		        </Callout.Text>
	        </Callout.Root>
            </div>   
        </div>
    )
    
}